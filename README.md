# Belisca 🍤⚡
### Instrumento de Inteligência Operacional e Pré-ERP para Delivery de Petiscos

O **Belisca** foi desenvolvido especificamente para cozinhas e operações de delivery focadas em petiscos, porções, boteco delivery e finger food.

Sua função central é realizar a **triangulação automática** entre:
1. **Pedidos Vendidos**: Acompanhamento de faturamento por canais (iFood com taxa média de 23%, WhatsApp Direto com taxa PIX de 0.9%, e Balcão/Retirada).
2. **Baixa de Estoque por Ficha Técnica (BOM)**: Cálculo em tempo real do consumo de carnes, laticínios, frituras e embalagens para cada pedido feito.
3. **DRE & Conciliação Financeira**: Lucro líquido real deduzindo CMV e taxas de aplicativos na hora.

---

## 🎨 Identidade Visual
- **Cores**: Amarelo Ouro/Âmbar (`#FFB800`, `#FFCA28`), Preto Profundo (`#0B0B0E`, `#141419`), Branco e Cinza Grafite.
- **Tipografia**: *Outfit* e *JetBrains Mono*.

---

## 🚀 Como Executar o Sistema Web

O servidor local já está ativo ou pode ser iniciado a qualquer momento:

```bash
# Na pasta do projeto:
python3 -m http.server 8080
```

Abra no seu navegador:
👉 **`http://localhost:8080`**

---

## 🤗 Modelos e Datasets do Hugging Face

### Modelos de Inteligência Artificial:
1. **`amazon/chronos-2` / `amazon/chronos-bolt-base`**: Previsão probabilística (quantis P10, P50, P90) de porções para fins de semana (quinta a domingo) e dimensionamento de insumos perecíveis.
2. **`Prior-Labs/TabPFN-v2-clf` / `Prior-Labs/TabPFN-v2-reg`**: Modelo transformer tabular para previsão instantânea de risco de ruptura e margem líquida.
3. **`google/timesfm-2.0-500m-pytorch`**: Previsão de demanda horária para planejar horários de pico e aquecimento de fritadeiras.

### Datasets no Hugging Face Hub:
1. **`EpicVic2193/restaurant-inventory-forecasting`**: Previsão de estoque para restaurantes e cozinhas de delivery com histórico de vendas, clima e sazonalidade.
2. **`aneesarom/Food-Delivery`**: Métricas de delivery de refeições, tempos de entrega e operação logística.
3. **`miminmoons/olist-ecommerce-for-delivery-and-review-prediction`**: Base brasileira com cálculo de fretes, meios de pagamento e reconciliação.
4. **`jocapc/ContosoRetailsDW`**: Estrutura relacional de ERP com tabelas fato `FactInventory` e `FactSales`.

---

## 🧪 Executar o Script de Demonstração em Python

Para rodar a simulação via terminal:

```bash
python3 previsao_demanda_petiscos.py
```
