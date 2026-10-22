# Datasets do Belisca (Delivery de Petiscos)

Esta pasta contém as bases de dados tabulares completas e prontas para uso local pelo ERP e pelos modelos de Inteligência Artificial:

---

### 1. `pedidos_delivery_petiscos.csv` (600 pedidos)
- **Descrição**: Histórico realista de pedidos de petiscos com registro de horários, bairros, canais, taxas e lucratividade líquida.
- **Campos**:
  - `id_pedido`: Código único (`BEL-1001` a `BEL-1600`)
  - `data_hora`: Timestamp do pedido
  - `dia_semana`: Dia da semana (Sex/Sáb com maior volume)
  - `canal_venda`: `iFood` (taxa 23%), `WhatsApp` (taxa 0.9% PIX), `Balcão` (taxa 1.9%)
  - `forma_pagamento`: PIX, Cartão Crédito, Cartão Débito, Dinheiro
  - `petisco`: Nome da porção comercializada
  - `quantidade`: Volume de porções no pedido
  - `preco_unitario`: Preço de cardápio
  - `valor_bruto`: Total vendido
  - `taxa_canal_reais`: Taxa cobrada pelo marketplace
  - `taxa_transacao_reais`: Taxa do meio de pagamento
  - `cmv_insumos_reais`: Custo dos insumos e embalagens consumidos
  - `lucro_liquido_reais`: Lucro real apurado no pedido
  - `margem_liquida_pct`: Margem percentual
  - `bairro_entrega`: Destino
  - `tempo_total_minutos`: Tempo de preparo + frete
  - `status`: Entregue / Cancelado

---

### 2. `fichas_tecnicas_insumos.csv`
- **Descrição**: Composição detalhada (Bill of Materials - BOM) de cada porção do cardápio com os pesos em gramas de insumos, embalagens, fornecedores e custos unitários.

---

### 3. `demanda_historica_sazonalidade.csv` (90 dias)
- **Descrição**: Série temporal diária agregada com variáveis exógenas:
  - `clima`: Limpo, Nublado, Chuva Leve, Chuva Forte (aumenta delivery)
  - `jogo_futebol`: Sim / Não (impacto direto em pedidos de boteco)
  - `total_pedidos_delivery`: Total de pedidos do dia
  - Quantidades vendidas por item (Batata, Tilápia, Costela, Tapioca, Cerveja)
  - Faturamento Bruto, CMV e Lucro Bruto Diário
- **Uso com IA**: Ideal para entrada no **Amazon Chronos-2**, **Google TimesFM** ou **TabPFN**.

---

### 4. `download_hf_dataset.py`
Script para sincronizar e baixar bases do **Hugging Face Hub** (`EpicVic2193/restaurant-inventory-forecasting`, `aneesarom/Food-Delivery`) quando houver conexão com o Hub.
