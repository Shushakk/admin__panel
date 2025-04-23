FROM python:3.9

WORKDIR /app

# Копируем и устанавливаем зависимости
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Копируем исходный код приложения
COPY ./app ./app

EXPOSE 3000

# Запуск приложения через uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "3000"]