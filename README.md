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

## 🤖 Previsão de demanda que funciona de verdade

O Belisca treina, ao iniciar, um modelo de **Gradient Boosting para regressão por quantis** em cima de `dataset/demanda_historica_sazonalidade.csv`. A previsão usa dia da semana, fim de semana, mês, clima e jogo de futebol para cada item do cardápio e retorna:

- **P10**: cenário conservador de demanda;
- **P50**: cenário mais provável, usado na compra padrão;
- **P90**: cenário de pico para dimensionar estoque de segurança.

O painel cruza automaticamente o P50 com a ficha técnica e o estoque exibido para indicar o insumo limitante e a quantidade a comprar. O endpoint é `GET /api/previsao?dias=3&clima=Nublado&jogo=false`.

> O histórico atual tem 90 dias. Por isso foi escolhido um modelo tabular leve e validável, em vez de deep learning: Transformers precisam de muito mais séries reais para não decorarem ruído e tornariam o deploy no Railway mais caro e lento. À medida que houver meses/anos de pedidos reais, Chronos/TimesFM pode ser comparado a este baseline por MAE antes de entrar em produção.

## 🚀 Como Executar o Sistema Web

O servidor local já está ativo ou pode ser iniciado a qualquer momento:

```bash
# Na pasta do projeto:
python3 server.py
```

Abra no seu navegador:
👉 **`http://localhost:8080`**. A rota `GET /health` confirma que o serviço está ativo.

## ☁️ Deploy no Railway

O repositório já inclui `Dockerfile`, `railway.json`, `Procfile` e health check. Para publicar:

1. No Railway, crie um projeto em **New Project → Deploy from GitHub Repo** e escolha `maykonlincolnusa/Belisca`.
2. O Railway detectará o `Dockerfile`, instalará `requirements.txt` e executará `python3 server.py`.
3. Em **Settings → Networking**, gere um domínio público. Confirme em `https://SEU-DOMINIO/health`.
4. Não é necessário configurar `PORT`: Railway injeta essa variável, e o servidor já escuta em `0.0.0.0`.

Para testes locais, use Python 3.11 ou superior e `pip install -r requirements.txt`.

---

## 🤗 Modelos e Datasets do Hugging Face

### Próximos modelos a comparar (quando houver histórico suficiente):
1. **`amazon/chronos-2` / `amazon/chronos-bolt-base`**
2. **`Prior-Labs/TabPFN-v2-clf` / `Prior-Labs/TabPFN-v2-reg`**
3. **`google/timesfm-2.0-500m-pytorch`**

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
