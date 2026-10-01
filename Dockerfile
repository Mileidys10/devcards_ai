# ==============================================================================
# Dockerfile — DevCards AI (FastAPI & Nemotecnia de Programación)
# Gobernado por el Estándar Google Cloud OKF v0.2
# ==============================================================================

FROM python:3.11-slim

LABEL maintainer="Mileidys10 <agamezmileidys@gmail.com>"
LABEL project="DevCards AI"
LABEL version="1.1.0"

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PORT=8000

WORKDIR /app

# Instalar dependencias del sistema mínimas
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Instalar dependencias de Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el código fuente de la aplicación
COPY app/ ./app/
COPY docs/ ./docs/
COPY run_devcards.py .

# Crear directorios de datos con permisos adecuados
RUN mkdir -p /app/app/data

EXPOSE 8000

# Healthcheck para verificar disponibilidad del backend
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/api/cards || exit 1

# Comando por defecto para iniciar el servidor FastAPI
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
