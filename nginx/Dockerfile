FROM nginx:alpine


RUN echo "list" && ls -la / > out.log

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

