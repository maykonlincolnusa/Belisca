# Belisca • Inteligência Operacional para Delivery de Petiscos
## Guia de Modelos & Datasets no Hugging Face Hub

O **Belisca** foi concebido como um instrumento cirúrgico para delivery de petiscos, porções e boteco delivery, com potencial de evolução para ERP completo. Sua missão primordial é **a triangulação perfeita entre:**

1. **Pedidos Vendidos (Entrada)**: Volume de porções vendidas por canal (iFood, WhatsApp/Cardápio Digital, Balcão/Takeaway) e taxas de transação.
2. **Baixa de Estoque por Ficha Técnica (Consumo Real)**: Desconto automático de gramas de carnes, queijos, batatas, óleo de fritura e embalagens térmicas.
3. **Reconciliação Financeira & DRE (Saída Líquida)**: Cálculo em tempo real do CMV (Custo da Mercadoria Vendida), taxas retidas pelos aplicativos, margem de contribuição e lucro líquido no bolso.

---

## 1. Modelos Recomendados no Hugging Face Hub

### 🥇 1. `amazon/chronos-2` e `amazon/chronos-bolt-base` (Amazon Science)
- **URL no Hugging Face**: [https://huggingface.co/amazon/chronos-2](https://huggingface.co/amazon/chronos-2)
- **Tipo**: *Foundation Model para Séries Temporais (Probabilistic Time-Series)*
- **Por que é ideal para o Belisca?**:
  - No delivery de petiscos, a venda tem alta sazonalidade semanal (quinta a domingo concentram 80% do faturamento).
  - O Chronos quantiza valores de vendas em tokens de linguagem e gera previsões probabilísticas em quantis (**P10: Cenário Pessimista**, **P50: Mais Provável**, **P90: Pico Máximo**).
  - **Uso no Estoque**: Evita que falte bacon, queijo ou batata no sábado à noite (ruptura), ao mesmo tempo em que previne o vencimento de carnes e queijos frescos na segunda-feira.
  - Suporta covariáveis externas (previsão de chuva, feriados, finais de campeonato de futebol).

### 🥈 2. `Prior-Labs/TabPFN-v2-clf` e `Prior-Labs/TabPFN-v2-reg` (Prior Labs)
- **URL no Hugging Face**: [https://huggingface.co/Prior-Labs/TabPFN-v2-clf](https://huggingface.co/Prior-Labs/TabPFN-v2-clf)
- **Tipo**: *Tabular In-Context Transformer (Classificação e Regressão Tabular)*
- **Por que é ideal para o Belisca?**:
  - É o modelo tabular mais rápido e preciso do mundo para dados estruturados de ERP.
  - Não precisa de treinamento demorado ou ajuste de hiperparâmetros (roda inferência direta em menos de 1 segundo).
  - **Classificação de Ruptura**: Identifica padrões tabulares (horário do pedido x velocidade de consumo x lote restante) e aciona o alerta vermelho na tela do operador.
  - **Previsão de Margem Financeira**: Prevê quais combos ou regiões de entrega geram margem líquida negativa após descontadas taxas e frete.

### 🥉 3. `google/timesfm-2.0-500m-pytorch` (Google Research)
- **URL no Hugging Face**: [https://huggingface.co/google/timesfm-2.0-500m-pytorch](https://huggingface.co/google/timesfm-2.0-500m-pytorch)
- **Tipo**: *Time-Series Foundation Model (500 milhões de parâmetros)*
- **Por que é ideal para o Belisca?**:
  - Excelente para modelar o fluxo de pedidos por faixa horária (curva de almoço x curva de happy hour noturno no delivery).
  - Ajuda o gestor a escalar o aquecimento de fritadeiras e a equipe de cozinha exatamente nos horários de maior pico.

---

## 2. Datasets Recomendados no Hugging Face Hub

### 📦 1. `EpicVic2193/restaurant-inventory-forecasting`
- **URL no Hugging Face**: [https://huggingface.co/datasets/EpicVic2193/restaurant-inventory-forecasting](https://huggingface.co/datasets/EpicVic2193/restaurant-inventory-forecasting)
- **Estrutura**: Parquet (10k a 100k registros).
- **Conteúdo**: Dados reais e simulados de cozinhas e restaurantes comerciais para previsão de consumo de insumos de cozinha com base em histórico de vendas, padrões de dias da semana, clima e eventos.
- **Como carregar no Python**:
```python
from datasets import load_dataset
dataset = load_dataset("EpicVic2193/restaurant-inventory-forecasting")
df = dataset["train"].to_pandas()
print(df.head())
```

### 🛵 2. `aneesarom/Food-Delivery`
- **URL no Hugging Face**: [https://huggingface.co/datasets/aneesarom/Food-Delivery](https://huggingface.co/datasets/aneesarom/Food-Delivery)
- **Estrutura**: Tabular (CSV / Parquet).
- **Conteúdo**: Dados operacionais de logística de delivery de comida, tempos de preparo na cozinha, clima e rotas de entrega.
- **Como carregar**:
```python
from datasets import load_dataset
delivery_data = load_dataset("aneesarom/Food-Delivery")
```

### 🇧🇷 3. `miminmoons/olist-ecommerce-for-delivery-and-review-prediction`
- **URL no Hugging Face**: [https://huggingface.co/datasets/miminmoons/olist-ecommerce-for-delivery-and-review-prediction](https://huggingface.co/datasets/miminmoons/olist-ecommerce-for-delivery-and-review-prediction)
- **Estrutura**: Parquet otimizado com dados monetários em Reais brasileiros (R$).
- **Conteúdo**: Histórico de pagamentos (PIX, boleto, cartão parcelado), cálculo de fretes e conciliação de recebíveis.

### 🏛️ 4. `jocapc/ContosoRetailsDW`
- **URL no Hugging Face**: [https://huggingface.co/datasets/jocapc/ContosoRetailsDW](https://huggingface.co/datasets/jocapc/ContosoRetailsDW)
- **Estrutura**: Star Schema (Modelo Estrela para ERP).
- **Conteúdo**: Tabelas relacionais clássicas com `FactInventory` (fato de estoque) cruzada com `FactSales` (fato de vendas) e dimensões de produtos e calendário.

---

## 3. Fórmulas da Triangulação Belisca

$$\text{Faturamento Bruto} = \sum (\text{Preço do Petisco} \times \text{Quantidade})$$

$$\text{CMV da Porção} = \sum_{i \in \text{Ficha}} (\text{Qtd Insumo}_i \times \text{Custo Unitário}_i) + \text{Embalagem Kraft}$$

$$\text{Taxa Efetiva do Canal} = \begin{cases} 
23\% \times \text{Preço}, & \text{se iFood} \\
0.9\% \times \text{Preço}, & \text{se WhatsApp (PIX)} \\
1.9\% \times \text{Preço}, & \text{se Balcão / Débito}
\end{cases}$$

$$\text{Lucro Líquido Real} = \text{Faturamento Bruto} - \text{Taxas dos Canais} - \text{CMV Total dos Insumos} - \text{Rateio Operacional}$$
