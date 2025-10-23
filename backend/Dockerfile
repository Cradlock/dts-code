FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    netcat-traditional \
    && rm -rf /var/lib/apt/lists/*


    # Создаём и переходим в рабочую директорию
WORKDIR /app

# Копируем файл с зависимостями и устанавливаем их (это кешируется, чтобы не ставить заново при изменении кода)
COPY requirements.txt .

RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Копируем весь код проекта
COPY . .

# Собираем статику Django (если используется)
RUN python manage.py collectstatic --noinput

# Открываем порт для приложения
EXPOSE 8000

# Запуск gunicorn, биндинг к 0.0.0.0:8000
CMD ["gunicorn", "core.wsgi:application", "--bind", "0.0.0.0:8000"]