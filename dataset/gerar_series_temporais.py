import csv
import random
from datetime import datetime, timedelta

# Gera histórico diário de 90 dias de vendas com clima e futebol para Chronos e TimesFM
random.seed(101)

data_inicial = datetime(2026, 7, 24)
registros = []

dias_da_semana_pt = {
    0: "Segunda-feira",
    1: "Terça-feira",
    2: "Quarta-feira",
    3: "Quinta-feira",
    4: "Sexta-feira",
    5: "Sábado",
    6: "Domingo"
}

for dia in range(90):
    dt = data_inicial + timedelta(days=dia)
    dia_num = dt.weekday()
    nome_dia = dias_da_semana_pt[dia_num]

    # Clima (chuva aumenta delivery de petiscos em ~25%)
    clima = random.choices(["Limpo", "Nublado", "Chuva Leve", "Chuva Forte"], weights=[0.5, 0.25, 0.15, 0.10])[0]
    multiplicador_clima = 1.25 if "Chuva" in clima else 1.0

    # Dia de futebol (quarta noite e domingo tarde/noite)
    dia_futebol = "Sim" if dia_num in [2, 6] and random.random() > 0.3 else "Não"
    multiplicador_futebol = 1.35 if dia_futebol == "Sim" else 1.0

    # Base de pedidos por dia da semana
    if dia_num in [0, 1]: # Seg, Ter (Dias fracos)
        base_pedidos = random.randint(12, 22)
    elif dia_num in [2, 3]: # Qua, Qui (Dias médios / Happy Hour)
        base_pedidos = random.randint(28, 48)
    else: # Sex, Sab, Dom (Pico absoluto de boteco em casa)
        base_pedidos = random.randint(65, 110)

    total_pedidos = int(base_pedidos * multiplicador_clima * multiplicador_futebol)
    
    # Distribuição de petiscos vendidos
    qtd_batata = int(total_pedidos * random.uniform(0.35, 0.48))
    qtd_tilapia = int(total_pedidos * random.uniform(0.18, 0.28))
    qtd_costela = int(total_pedidos * random.uniform(0.20, 0.30))
    qtd_tapioca = int(total_pedidos * random.uniform(0.15, 0.25))
    qtd_cerveja = int(total_pedidos * random.uniform(0.30, 0.60))

    faturamento_bruto = (qtd_batata * 42.0) + (qtd_tilapia * 56.0) + (qtd_costela * 48.0) + (qtd_tapioca * 38.0) + (qtd_cerveja * 32.0)
    cmv_estimado = (qtd_batata * 11.8) + (qtd_tilapia * 18.2) + (qtd_costela * 14.65) + (qtd_tapioca * 12.45) + (qtd_cerveja * 13.85)

    registros.append({
        "data": dt.strftime("%Y-%m-%d"),
        "dia_da_semana": nome_dia,
        "clima": clima,
        "jogo_futebol": dia_futebol,
        "total_pedidos_delivery": total_pedidos,
        "vendas_batata_cheddar": qtd_batata,
        "vendas_isca_tilapia": qtd_tilapia,
        "vendas_bolinho_costela": qtd_costela,
        "vendas_dadinho_tapioca": qtd_tapioca,
        "vendas_combo_cerveja": qtd_cerveja,
        "faturamento_bruto_reais": round(faturamento_bruto, 2),
        "cmv_total_reais": round(cmv_estimado, 2),
        "lucro_bruto_reais": round(faturamento_bruto - cmv_estimado, 2)
    })

fieldnames = list(registros[0].keys())
with open("/Users/maykonlincolndeazeredosantos/Desktop/Belisca/dataset/demanda_historica_sazonalidade.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(registros)

print(f"Dataset de séries temporais gerado com sucesso: {len(registros)} dias de histórico.")
