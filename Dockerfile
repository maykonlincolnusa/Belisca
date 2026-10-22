# Belisca Pre-ERP • Container de Produção para Railway
FROM python:3.11-slim

# Evita buffering de logs para o console do Railway
ENV PYTHONUNBUFFERED=1
ENV PORT=8080

WORKDIR /app

# Instala dependências
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia todo o código da aplicação e datasets
COPY . .

# Porta padrão de escuta (o Railway injeta a variável de ambiente $PORT dinamicamente)
EXPOSE 8080

# Inicia o servidor com acesso aberto
CMD ["python3", "server.py"]
