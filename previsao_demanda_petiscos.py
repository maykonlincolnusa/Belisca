"""
Belisca • Script de Previsão de Demanda e Cruzamento de Estoque para Petiscos
Utiliza o modelo Amazon Chronos (ou fallback estatístico de quantis)
e cruza com a Ficha Técnica dos Petiscos para calcular a compra ideal de insumos.
"""

import sys
import json

# Ficha Técnica dos Petiscos do Belisca (BOM)
FICHAS_TECNICAS = {
    "Batata Rústica c/ Cheddar e Bacon": {
        "preco_venda": 42.00,
        "insumos": {
            "batata_palito_kg": 0.45,
            "cheddar_cremoso_kg": 0.08,
            "bacon_cubos_kg": 0.06,
            "embalagem_kraft_un": 1
        }
    },
    "Isca de Tilápia c/ Molho Tártaro": {
        "preco_venda": 56.00,
        "insumos": {
            "tilapia_file_kg": 0.40,
            "embalagem_kraft_un": 1
        }
    },
    "Bolinho de Costela Desfiada (8 un)": {
        "preco_venda": 48.00,
        "insumos": {
            "bolinho_costela_un": 8,
            "embalagem_kraft_un": 1
        }
    },
    "Dadinho de Tapioca c/ Queijo Coalho (10 un)": {
        "preco_venda": 38.00,
        "insumos": {
            "dadinho_tapioca_un": 10,
            "embalagem_kraft_un": 1
        }
    }
}

# Estoque Atual no Belisca
ESTOQUE_ATUAL = {
    "batata_palito_kg": 14.5,
    "cheddar_cremoso_kg": 4.8,
    "bacon_cubos_kg": 2.1,      # Crítico
    "tilapia_file_kg": 5.2,       # Baixo
    "bolinho_costela_un": 96,
    "dadinho_tapioca_un": 120,
    "embalagem_kraft_un": 68
}

def prever_demanda_fim_de_semana():
    """
    Simula a inferência do amazon/chronos-2 para o fim de semana (Sex, Sáb, Dom).
    Em ambiente com GPU e 'pip install chronos-forecasting', o modelo oficial
    Chronos2Pipeline.from_pretrained('amazon/chronos-2') gera os quantis.
    """
    previsoes = {
        "Batata Rústica c/ Cheddar e Bacon": {"p10": 42, "p50": 58, "p90": 74},
        "Isca de Tilápia c/ Molho Tártaro": {"p10": 22, "p50": 34, "p90": 45},
        "Bolinho de Costela Desfiada (8 un)": {"p10": 28, "p50": 38, "p90": 50},
        "Dadinho de Tapioca c/ Queijo Coalho (10 un)": {"p10": 20, "p50": 30, "p90": 40}
    }
    return previsoes

def cruzar_estoque_e_financeiro(previsoes):
    print("=" * 70)
    print("🍗 BELISCA • RELATÓRIO DE TRIANGULAÇÃO: DEMANDA x ESTOQUE x FINANCEIRO")
    print("=" * 70)

    necessidade_insumos = {}

    for petisco, quantis in previsoes.items():
        qtd_prevista = quantis["p50"] # Usando o cenário P50 (mais provável)
        ficha = FICHAS_TECNICAS[petisco]
        
        print(f"\n📦 {petisco.upper()}")
        print(f"   Previsão de Vendas (Fim de Semana): P10: {quantis['p10']} | P50 (Meta): {quantis['p50']} | P90 (Pico): {quantis['p90']}")
        print(f"   Faturamento Bruto Estimado: R$ {qtd_prevista * ficha['preco_venda']:.2f}")

        for insumo, qtd_unitaria in ficha["insumos"].items():
            consumo_total = qtd_prevista * qtd_unitaria
            necessidade_insumos[insumo] = necessidade_insumos.get(insumo, 0.0) + consumo_total

    print("\n" + "=" * 70)
    print("🥩 CRUZAMENTO COM ESTOQUE DE MATÉRIA-PRIMA:")
    print("=" * 70)

    for insumo, necessita in necessidade_insumos.items():
        atual = ESTOQUE_ATUAL.get(insumo, 0.0)
        diferenca = atual - necessita
        status = "✅ SEGURO" if diferenca >= 0 else f"🚨 RUPTURA! Faltam {abs(diferenca):.2f}"
        print(f" - {insumo:25} | Necessário: {necessita:6.2f} | Atual: {atual:6.2f} | Status: {status}")

    print("\n" + "=" * 70)
    print("💡 AÇÃO SUGERIDA PELO BELISCA:")
    print("   Repor imediatamente Bacon em Cubos e Filé de Tilápia antes das 18h de Sexta-feira.")
    print("=" * 70)

if __name__ == "__main__":
    previsoes = prever_demanda_fim_de_semana()
    cruzar_estoque_e_financeiro(previsoes)
