FROM python:3.13-slim

WORKDIR /app

COPY requirements.txt .

RUN addgroup --system app && adduser --system --ingroup app app \
    && pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

USER app

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
