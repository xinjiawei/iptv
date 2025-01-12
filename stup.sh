#!/bin/bash
cron
service lighttpd start
/app/udpxy -S -a 0.0.0.0 -p 4022 -m 0.0.0.0 -c 100 -l /app/config/udpxy.log -B 2097152 -R -1 -M 300

# ./heiptv_emulate
tail -f /dev/null