FROM nginx:alpine


COPY nginx/default.conf /etc/nginx/nginx.conf

RUN ls -a ./admin


EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

