import csv
import random
from datetime import datetime, timedelta

# Gera um dataset rico e realista de pedidos de petiscos para o Belisca
random.seed(42)

canais = [
    ("iFood", 0.23, ["Cartão Crédito", "Cartão Débito", "Saldo iFood", "PIX"]),
    ("WhatsApp", 0.009, ["PIX", "Dinheiro"]),
    ("Balcão", 0.019, ["Cartão Débito", "Cartão Crédito", "PIX", "Dinheiro"])
]

petiscos_info = {
    "Batata Rústica c/ Cheddar e Bacon": {"preco": 42.00, "cmv": 11.80, "tempo_prep": 14},
    "Isca de Tilápia c/ Molho Tártaro": {"preco": 56.00, "cmv": 18.20, "tempo_prep": 18},
    "Bolinho de Costela Desfiada (8 un)": {"preco": 48.00, "cmv": 14.65, "tempo_prep": 12},
    "Dadinho de Tapioca c/ Queijo Coalho (10 un)": {"preco": 38.00, "cmv": 12.45, "tempo_prep": 10},
    "Mini Pastéis Mistos de Boteco (10 un)": {"preco": 36.00, "cmv": 10.95, "tempo_prep": 12},
    "Combo 2x Cerveja IPA Lata 350ml": {"preco": 32.00, "cmv": 13.85, "tempo_prep": 2}
}

bairros = ["Centro", "Jardins", "Vila Nova", "Bela Vista", "Santa Cecília", "Pinheiros", "Moema", "Perdizes"]
status_list = ["Entregue", "Entregue", "Entregue", "Entregue", "Entregue", "Cancelado"]

data_inicio = datetime(2026, 9, 1, 18, 0)
rows = []

for i in range(1, 601):
    # Sorteio de data com maior concentração em fins de semana
    dias = random.randint(0, 45)
    hora = random.choice([18, 19, 20, 21, 22, 23])
    minuto = random.randint(0, 59)
    dt_pedido = data_inicio + timedelta(days=dias, hours=hora, minutes=minuto)
    dia_semana = dt_pedido.strftime("%A")

    # Canal com peso maior para iFood e WhatsApp
    canal, taxa_canal_pct, formas_pag = random.choices(canais, weights=[0.55, 0.35, 0.10])[0]
    forma_pag = random.choice(formas_pag)

    # Petisco
    petisco_nome = random.choice(list(petiscos_info.keys()))
    qtd = random.choices([1, 2, 3], weights=[0.75, 0.20, 0.05])[0]
    p_info = petiscos_info[petisco_nome]

    valor_bruto = round(p_info["preco"] * qtd, 2)
    taxa_canal_val = round(valor_bruto * taxa_canal_pct, 2)
    taxa_transacao_val = round(valor_bruto * (0.015 if "Crédito" in forma_pag else 0.005), 2)
    cmv_total = round(p_info["cmv"] * qtd, 2)
    
    status = random.choice(status_list)
    if status == "Cancelado":
        lucro_liquido = round(-cmv_total * 0.5, 2) # Perda de insumos
    else:
        lucro_liquido = round(valor_bruto - taxa_canal_val - taxa_transacao_val - cmv_total, 2)

    tempo_entrega = p_info["tempo_prep"] + random.randint(15, 35)

    rows.append({
        "id_pedido": f"BEL-{1000 + i}",
        "data_hora": dt_pedido.strftime("%Y-%m-%d %H:%M:%S"),
        "dia_semana": dia_semana,
        "canal_venda": canal,
        "forma_pagamento": forma_pag,
        "petisco": petisco_nome,
        "quantidade": qtd,
        "preco_unitario": p_info["preco"],
        "valor_bruto": valor_bruto,
        "taxa_canal_reais": taxa_canal_val,
        "taxa_transacao_reais": taxa_transacao_val,
        "cmv_insumos_reais": cmv_total,
        "lucro_liquido_reais": lucro_liquido,
        "margem_liquida_pct": round((lucro_liquido / valor_bruto) * 100, 1) if valor_bruto > 0 else 0,
        "bairro_entrega": random.choice(bairros),
        "tempo_total_minutos": tempo_entrega,
        "status": status
    })

fieldnames = list(rows[0].keys())
with open("/Users/maykonlincolndeazeredosantos/Desktop/Belisca/dataset/pedidos_delivery_petiscos.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(rows)

print(f"Dataset de pedidos gerado com sucesso: {len(rows)} linhas.")
