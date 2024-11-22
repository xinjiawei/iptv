FROM ubuntu:22.04
WORKDIR /app
USER root
COPY . .
ENV TZ=Asia/Shanghai
ENV DEBIAN_FRONTEND=noninteractive
RUN cp /etc/apt/sources.list /etc/apt/sources.list.bak && sed -i 's/deb.debian.org/mirrors.ustc.edu.cn/g' /etc/apt/sources.list && sed -i 's/deb.debian.org/mirrors.163.com/g' /etc/apt/sources.list && apt-get update
RUN apt-get -y install --assume-yes dialog apt-utils nano cron curl lighttpd htop iputils-ping
RUN chmod u+x /app/stup.sh && chmod u+x /app/move_to_webroot.sh && chmod u+x /app/heiptv_emulate && chmod u+x /app/udpxy && cp /app/lib* /lib/x86_64-linux-gnu/ && /bin/cp -rf /app/lighttpd.conf /etc/lighttpd/ && crontab /app/cron/schedule.cron
RUN echo "${TZ}" > /etc/timezone && ln -sf /usr/share/zoneinfo/${TZ} /etc/localtime && apt-get -y install --assume-yes tzdata
ENTRYPOINT ["./stup.sh"]

# docker build --no-cache -t harbor.mb6.top:32570/xinjiawei1/heiptv:4.1.13 .