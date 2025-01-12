# iptv 模拟
> 河北（四川）电信iptv，模拟机顶盒内的逻辑获取直播源，无需udproxy。
> https://hub.docker.com/r/xinjiawei1/heiptv
> ~~初学node试水作，不是很优雅。~~ 使用cpp重写, 内置udproxy, 每日定时获取所有频道epg数据, 生成igmp和rtsp等三种格式的播放地址来实现兼容播放各种播放器,例如emby和mytv。内置lighttpd, 访问8000端口可以下载m3u和epg数据。
>
> docker 镜像生成后运行容器会生成配置文件, 需要手动改几个关键配置参数适配地方地区.
>
> 要获取node旧版本, 在main分支。
>
> 博客：https://blog.jiawei.xin/?p=1267
## 注意
> 请注意，这个项目是无法直接使用的。请根据自己的情况获取字段，尤其是几个认证服务器的地址和认证参数。
> 
> ~~使用了 http://epg.51zmt.top:8000 的封面图匹配接口，请勿频繁请求，将会导致ip被封禁，建议一个星期运行一次。~~ 使用iptv盒子内置的台标
# 配置文件
> 
> 配置文件在第一次运行会自动生成, 位置为 /app/config/
>
## 解释
    "debug_mode": 0 调试模式, 会保存下来大量日志,默认关闭,
    "main_version": "4.1.31",
    "compile_version": "2.5r",
    "host": "直播服务器地址",
    "port": "直播服务器端口",
    "mac": "机顶盒mac",
    "iptv_account": "iptv账号",
    "iptv_passwd": "这个留空",
    "stbid": "机顶盒设备id",
    "uuid_string": "这个留空",
    "tempkey": "抓包获得, 或者保持任意32位key即可, 数字0-9, 字母A-F",
    "default_cover_url": "若节目没有封面, 指定的默认封面地址",
    "syslog_host": "日志上报服务器地址, 如果报错就写127.0.0.1",
    "syslog_port": "日志上报服务器端口, 如果报错就写8080",
    "udpxy_host_url": "udpxy服务器播放地址前缀",
    "epg_host_url": "epg服务器地址, 理论上和上方地址一样",
    "epg_host_port": "epg服务器端口",
    "epg_during": "默认1.5天, 最好不动, 可能报错",
    "description": "欢迎使用",
    "null_description": "此节目提供商暂时没有提供导播源",
    "nullepginfo": "暂无导播信息",
    "maxcount": "80 最好不动, 可能报错",
    "timedelay_cover_get": 1000 最好不动, 可能报错,
    "timedelay_epg_get": 2000 最好不动, 可能报错
## 示例参数
`
{
"debug_mode": 0,
"main_version": "4.1.31",
"compile_version": "2.5r",
"host": "192.168.49.143",
"port": "33200",
"mac": "50:01:6B:24:**:**",
"iptv_account": "ip156********@itv",
"iptv_passwd": "",
"stbid": "001003990060893016345001********",
"uuid_string": "21dba401-33c5-40de-b1d0-4f30a7f60000",
"tempkey": "768B********5AB81F642690********",
"default_cover_url": "",
"syslog_host": "10.168.1.128",
"syslog_port": 514,
"udpxy_host_url": "http://10.168.1.174:4022/udp/",
"epg_host_url": "192.168.49.143",
"epg_host_port": "33200",
"epg_during": "1.5",
"description": "欢迎使用",
"null_description": "此节目提供商暂时没有提供导播源",
"nullepginfo": "暂无导播信息",
"maxcount": 80,
"timedelay_cover_get": 1000,
"timedelay_epg_get": 2000
}
`
# 运行效果
>
> https://epg.mb6.top
>
> ![example](https://cf.mb6.top/lib/images/github/582574355.png)
> ![example](https://cf.mb6.top/lib/images/github/698576572.png)
> ![example](https://cf.mb6.top/lib/images/github/968527825.png)
> ![example](https://cf.mb6.top/lib/images/github/yt84561g56t1g.png)
> ![example](https://cf.mb6.top/lib/images/github/4gtwedsv49eg.png)
