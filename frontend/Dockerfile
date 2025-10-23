# ---------- Этап сборки React ----------
FROM node:18 AS build

WORKDIR /app

# Устанавливаем зависимости
COPY package*.json ./
RUN npm install

# Копируем исходный код и собираем билд
COPY . .
RUN npm run build


# ---------- Этап раздачи через Nginx ----------
FROM nginx:alpine

# Копируем собранные файлы в Nginx
COPY --from=build /app/build /usr/share/nginx/html

# (опционально) можно заменить дефолтный конфиг nginx
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Открываем порт 80
EXPOSE 80

# Запускаем Nginx
CMD ["nginx", "-g", "daemon off;"]
