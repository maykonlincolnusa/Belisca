"""Modelo de previsão de demanda do Belisca.

Treina regressões de quantis independentes para cada item do cardápio.  A saída
P10/P50/P90 permite comprar para o cenário desejado em vez de tratar uma única
previsão como certeza. O modelo é recalculado ao subir a aplicação porque o
dataset é pequeno; em produção, a mesma interface pode receber o CSV exportado
do iFood/99 e ser retreinada a cada fechamento diário.
"""

from __future__ import annotations

import csv
from datetime import date, datetime, timedelta
from pathlib import Path
from statistics import mean
from typing import Dict, Iterable, List

from sklearn.ensemble import GradientBoostingRegressor
from sklearn.metrics import mean_absolute_error


PRODUCT_COLUMNS = {
    "Batata Rústica c/ Cheddar e Bacon": "vendas_batata_cheddar",
    "Isca de Tilápia c/ Molho Tártaro": "vendas_isca_tilapia",
    "Bolinho de Costela Desfiada (8 un)": "vendas_bolinho_costela",
    "Dadinho de Tapioca c/ Queijo Coalho (10 un)": "vendas_dadinho_tapioca",
    "Combo 2x Cerveja IPA Lata 350ml": "vendas_combo_cerveja",
}


def _as_bool(value: str) -> int:
    return 1 if value.strip().lower() in {"sim", "true", "1", "yes"} else 0


def _weather_score(weather: str) -> int:
    weather = (weather or "").lower()
    if "forte" in weather:
        return 2
    if "chuva" in weather:
        return 1
    return 0


def _features(day: date, weather: str, football: bool) -> List[float]:
    """Codifica calendário e covariáveis disponíveis no histórico."""
    weekday = day.weekday()
    return [
        weekday,
        1 if weekday >= 4 else 0,  # sexta a domingo
        _weather_score(weather),
        int(football),
        day.month,
    ]


class DemandForecaster:
    def __init__(self, dataset_path: Path):
        self.dataset_path = dataset_path
        self.rows = self._load_rows()
        if len(self.rows) < 30:
            raise ValueError("São necessários ao menos 30 dias de histórico para gerar a previsão.")
        self.models: Dict[str, Dict[str, GradientBoostingRegressor]] = {}
        self.mae: Dict[str, float] = {}
        self._train()

    def _load_rows(self) -> List[dict]:
        with self.dataset_path.open(encoding="utf-8", newline="") as file:
            rows = list(csv.DictReader(file))
        for row in rows:
            row["_date"] = datetime.strptime(row["data"], "%Y-%m-%d").date()
        return sorted(rows, key=lambda row: row["_date"])

    def _train(self) -> None:
        # Mantém os últimos 14 dias para uma medida honesta de erro exibida na API.
        split = max(30, len(self.rows) - 14)
        train_rows, test_rows = self.rows[:split], self.rows[split:]
        x_train = [_features(r["_date"], r["clima"], _as_bool(r["jogo_futebol"])) for r in train_rows]
        x_test = [_features(r["_date"], r["clima"], _as_bool(r["jogo_futebol"])) for r in test_rows]

        for product, column in PRODUCT_COLUMNS.items():
            models = {}
            for label, alpha in (("p10", 0.10), ("p50", 0.50), ("p90", 0.90)):
                model = GradientBoostingRegressor(
                    loss="quantile",
                    alpha=alpha,
                    n_estimators=120,
                    max_depth=2,
                    learning_rate=0.05,
                    min_samples_leaf=3,
                    random_state=42,
                )
                model.fit(x_train, [float(row[column]) for row in train_rows])
                models[label] = model
            self.models[product] = models
            if x_test:
                predicted = models["p50"].predict(x_test)
                observed = [float(row[column]) for row in test_rows]
                self.mae[product] = round(mean_absolute_error(observed, predicted), 1)
            else:
                self.mae[product] = 0.0

    @property
    def last_date(self) -> date:
        return self.rows[-1]["_date"]

    def forecast(self, days: int = 3, weather: str = "Nublado", football: bool = False) -> dict:
        days = max(1, min(int(days), 14))
        periods = []
        totals = {product: {"p10": 0, "p50": 0, "p90": 0} for product in PRODUCT_COLUMNS}
        for offset in range(1, days + 1):
            target = self.last_date + timedelta(days=offset)
            x = [_features(target, weather, football)]
            products = {}
            for product, models in self.models.items():
                # Impede inversão de quantis por variação numérica do modelo.
                values = sorted(max(0, int(round(models[q].predict(x)[0]))) for q in ("p10", "p50", "p90"))
                prediction = dict(zip(("p10", "p50", "p90"), values))
                products[product] = prediction
                for quantile, value in prediction.items():
                    totals[product][quantile] += value
            periods.append({"data": target.isoformat(), "produtos": products})

        return {
            "modelo": "Gradient Boosting Quantile Regression",
            "versao": "1.0",
            "historico_dias": len(self.rows),
            "treinado_ate": self.last_date.isoformat(),
            "premissas": {"clima": weather, "jogo_futebol": football},
            "erro_mae_p50_por_produto": self.mae,
            "periodos": periods,
            "totais": totals,
        }
