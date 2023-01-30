FROM node:latest
EXPOSE 8080
WORKDIR /app
USER root
COPY . .
RUN npm install --omit=dev --loglevel=verbose --registry=https://registry.npm.taobao.org
RUN cp /etc/apt/sources.list /etc/apt/sources.list.bak && sed -i 's/deb.debian.org/mirrors.ustc.edu.cn/g' /etc/apt/sources.list && sed -i 's/deb.debian.org/mirrors.163.com/g' /etc/apt/sources.list && apt-get update && apt-get -y install --assume-yes cron && apt-get -y install --assume-yes nano
RUN echo '30 20 * * 1 . /etc/profile && /usr/local/bin/node /app/main.js >> /app/log/app.log 2>&1 &' | crontab
COPY stup.sh /etc/init.d/
RUN chmod u+x /etc/init.d/stup.sh
ENTRYPOINT ["/etc/init.d/stup.sh"]