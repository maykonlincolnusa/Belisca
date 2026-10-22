import os
import sys
import json
import csv
from pathlib import Path
from urllib.parse import parse_qs, urlparse
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler

from forecast_service import DemandForecaster

PORT = int(os.environ.get("PORT", 8080))
HOST = "0.0.0.0"

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FORECASTER = DemandForecaster(Path(BASE_DIR) / "dataset" / "demanda_historica_sazonalidade.csv")

class BeliscaRailwayHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=BASE_DIR, **kwargs)

    def end_headers(self):
        # Acesso totalmente aberto (Open Access & CORS livre)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "*")
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        parsed_url = urlparse(self.path)
        query = parse_qs(parsed_url.query)
        path = parsed_url.path
        # Health check para Railway
        if path == "/health":
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.end_headers()
            response = {
                "status": "healthy",
                "app": "Belisca Pre-ERP",
                "access": "public_open",
                "version": "1.1.0",
                "host": HOST,
                "port": PORT
            }
            self.wfile.write(json.dumps(response, ensure_ascii=False).encode("utf-8"))
            return

        # API de Relatórios e KPIs Consolidados dos 600 pedidos
        if path == "/api/kpis":
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.end_headers()
            
            csv_path = os.path.join(BASE_DIR, "dataset", "pedidos_delivery_petiscos.csv")
            kpi_data = self._calcular_kpis_csv(csv_path)
            self.wfile.write(json.dumps(kpi_data, ensure_ascii=False).encode("utf-8"))
            return

        # API de Pedidos do Dataset
        if path == "/api/previsao":
            try:
                days = int(query.get("dias", ["3"])[0])
                clima = query.get("clima", ["Nublado"])[0]
                jogo = query.get("jogo", ["false"])[0].lower() in {"1", "true", "sim"}
                response = FORECASTER.forecast(days=days, weather=clima, football=jogo)
                self.send_response(200)
            except (ValueError, TypeError) as error:
                response = {"error": str(error)}
                self.send_response(400)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.end_headers()
            self.wfile.write(json.dumps(response, ensure_ascii=False).encode("utf-8"))
            return

        if path.startswith("/api/pedidos"):
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.end_headers()
            
            csv_path = os.path.join(BASE_DIR, "dataset", "pedidos_delivery_petiscos.csv")
            pedidos = []
            if os.path.exists(csv_path):
                with open(csv_path, "r", encoding="utf-8") as f:
                    reader = csv.DictReader(f)
                    pedidos = list(reader)
            self.wfile.write(json.dumps({"total": len(pedidos), "pedidos": pedidos[:100]}, ensure_ascii=False).encode("utf-8"))
            return

        # Rota raiz aberta para a interface
        if self.path == "/" or self.path == "":
            self.path = "/index.html"
            
        return super().do_GET()

    def _calcular_kpis_csv(self, csv_path):
        if not os.path.exists(csv_path):
            return {"error": "Dataset não encontrado"}

        total_pedidos = 0
        total_bruto = 0.0
        total_taxas = 0.0
        total_cmv = 0.0
        total_lucro = 0.0
        por_canal = {}
        por_petisco = {}

        with open(csv_path, "r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                if row.get("status") == "Cancelado":
                    continue
                total_pedidos += 1
                bruto = float(row.get("valor_bruto", 0))
                taxa_canal = float(row.get("taxa_canal_reais", 0))
                taxa_trans = float(row.get("taxa_transacao_reais", 0))
                cmv = float(row.get("cmv_insumos_reais", 0))
                lucro = float(row.get("lucro_liquido_reais", 0))

                total_bruto += bruto
                total_taxas += (taxa_canal + taxa_trans)
                total_cmv += cmv
                total_lucro += lucro

                # Por canal
                canal = row.get("canal_venda", "Outro")
                if canal not in por_canal:
                    por_canal[canal] = {"pedidos": 0, "faturamento": 0.0, "taxas": 0.0, "lucro": 0.0}
                por_canal[canal]["pedidos"] += 1
                por_canal[canal]["faturamento"] += bruto
                por_canal[canal]["taxas"] += (taxa_canal + taxa_trans)
                por_canal[canal]["lucro"] += lucro

                # Por petisco
                petisco = row.get("petisco", "Outro")
                if petisco not in por_petisco:
                    por_petisco[petisco] = {"qtd": 0, "receita": 0.0, "cmv": 0.0}
                por_petisco[petisco]["qtd"] += int(row.get("quantidade", 1))
                por_petisco[petisco]["receita"] += bruto
                por_petisco[petisco]["cmv"] += cmv

        ticket_medio = total_bruto / total_pedidos if total_pedidos > 0 else 0
        cmv_pct = (total_cmv / total_bruto) * 100 if total_bruto > 0 else 0
        margem_liq_pct = (total_lucro / total_bruto) * 100 if total_bruto > 0 else 0

        # Curva ABC
        itens_ordenados = sorted(por_petisco.items(), key=lambda x: x[1]["receita"], reverse=True)
        acumulado = 0.0
        curva_abc = []
        for nome, dados in itens_ordenados:
            pct_item = (dados["receita"] / total_bruto) * 100 if total_bruto > 0 else 0
            acumulado += pct_item
            classe = "A" if acumulado <= 70 else ("B" if acumulado <= 90 else "C")
            curva_abc.append({
                "petisco": nome,
                "qtd_vendida": dados["qtd"],
                "receita": round(dados["receita"], 2),
                "cmv": round(dados["cmv"], 2),
                "participacao_pct": round(pct_item, 1),
                "classe_abc": classe
            })

        return {
            "periodo": "Últimos 45 dias operacionais (Dataset Belisca)",
            "total_pedidos": total_pedidos,
            "faturamento_bruto": round(total_bruto, 2),
            "ticket_medio": round(ticket_medio, 2),
            "cmv_total": round(total_cmv, 2),
            "cmv_pct": round(cmv_pct, 1),
            "taxas_totais": round(total_taxas, 2),
            "taxas_pct": round((total_taxas / total_bruto) * 100, 1) if total_bruto > 0 else 0,
            "lucro_liquido_real": round(total_lucro, 2),
            "margem_liquida_pct": round(margem_liq_pct, 1),
            "ponto_equilibrio_diario": 14,
            "desempenho_canais": por_canal,
            "curva_abc": curva_abc
        }

def run_server():
    server_address = (HOST, PORT)
    httpd = ThreadingHTTPServer(server_address, BeliscaRailwayHandler)
    print("=" * 65)
    print(f"🚀 BELISCA • SERVIDOR RAILWAY PRONTO COM ACESSO ABERTO")
    print(f"   URL: http://{HOST}:{PORT}")
    print(f"   Health Check: http://{HOST}:{PORT}/health")
    print(f"   API KPIs: http://{HOST}:{PORT}/api/kpis")
    print(f"   API Pedidos: http://{HOST}:{PORT}/api/pedidos")
    print("=" * 65)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServidor finalizado.")
        httpd.server_close()

if __name__ == "__main__":
    run_server()
