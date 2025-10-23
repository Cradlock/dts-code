FROM nginx:alpine


COPY nginx/default.conf /etc/nginx/nginx.conf

COPY admin/build admin/build


EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

