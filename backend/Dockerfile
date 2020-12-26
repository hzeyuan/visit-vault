FROM node:12.20.0-alpine3.11

RUN apk add --no-cache bash \
    supervisor=4.1.0-r0 \
    nginx=1.16.1-r6 && \
    rm -rf /var/cache/apk/* && \
    mkdir -p /var/log/supervisor && \
    mkdir -p /etc/nginx/sites-enabled/ && \
    mkdir -p /var/www/html/



ADD deploy/nginx/supervisord.conf /etc/supervisord.conf
ADD deploy/nginx/nginx.conf /etc/nginx/nginx.conf
ADD deploy/nginx/sites-enabled/default.conf /etc/nginx/sites-enabled/default.conf

ADD deploy/scripts/start.sh /start.sh



WORKDIR /opt

COPY package.json .

RUN npm config set registry https://registry.npm.taobao.org && npm install

COPY . .

# RUN git submodule init && git submodule update --remote
ENV EGG_SERVER_ENV=prod 

# TODO egg.js 生产环境需要 npm run tsc 编译为 js 后才能运行，但是 type-graphql 编译后反射 schema 会异常，因此这里暂时先用开发环境启动
RUN npm run tsc
EXPOSE 80

# CMD [ "npm", "run", "dev" ]


CMD ["/bin/bash","/start.sh"]

