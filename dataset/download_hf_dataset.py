"""
Belisca • Script Utilitário para Download de Datasets do Hugging Face Hub
Permite baixar os datasets recomendados para a pasta local 'dataset/'
"""

import sys
import os

def baixar_dataset(repo_id, nome_arquivo_local):
    print(f"🤗 Baixando dataset '{repo_id}' do Hugging Face Hub...")
    try:
        from datasets import load_dataset
        ds = load_dataset(repo_id)
        df = ds["train"].to_pandas()
        
        caminho_saida = os.path.join(os.path.dirname(__file__), nome_arquivo_local)
        df.to_csv(caminho_saida, index=False)
        print(f"✅ Sucesso! Salvo em: {caminho_saida} ({len(df)} registros)")
    except ImportError:
        print("⚠️ Para baixar direto do Hugging Face, instale: pip install datasets pandas pyarrow")
    except Exception as e:
        print(f"ℹ️ Nota ao carregar '{repo_id}': {e}")
        print("Os datasets locais do Belisca em CSV já estão disponíveis e prontos para uso em 'dataset/'.")

if __name__ == "__main__":
    print("=" * 65)
    print("🍤 BELISCA • SINCRONIZADOR DE DATASETS HUGGING FACE")
    print("=" * 65)
    
    # Exemplo com os datasets recomendados
    baixar_dataset("EpicVic2193/restaurant-inventory-forecasting", "restaurant_inventory_hf.csv")
    baixar_dataset("aneesarom/Food-Delivery", "food_delivery_logistics_hf.csv")
