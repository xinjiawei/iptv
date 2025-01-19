# iptv 模拟
## 更新
>
> 2025.1.19 更新：支持获取过去7天epg，新增配置参数epg_before，basic_info_host，basic_info_port。调整休眠为至少100ms，防止风控。

## 简介
> 河北（四川）电信iptv，模拟机顶盒内的逻辑获取直播源，无需udproxy。
> 
> ~~初学node试水作，不是很优雅。~~ 使用cpp重写, 内置udproxy, 每日定时获取所有频道epg数据, 生成igmp和rtsp等三种格式的播放地址来实现兼容播放各种播放器,例如emby和mytv。内置lighttpd, 访问8080端口可以下载m3u和epg数据,访问4022端口使用内置udpxy。
>
> docker 镜像生成后运行容器会生成配置文件, 需要手动改几个关键配置参数适配地方地区.
>
> https://hub.docker.com/r/xinjiawei1/heiptv
>
> 要获取node旧版本, 在main分支。
>
> 博客：https://blog.jiawei.xin/?p=1267
## 注意
>
> 请注意，这个项目是无法直接使用的。请根据自己的情况抓包获取字段，尤其是几个认证服务器的地址和认证参数。
>
> 使用此项目首先需要
> 1. 创建好两个目录并挂载, 如图
>
> ![example](https://cf.mb6.top/lib/images/github/698576572.png)
>
> 2. 然后把我提供的config和output目录内容提前放到挂载的对应目录, 否则内置web环境无法启动.
> 3. 之后再启动容器, 等待首次启动生成配置文件, 编辑配置文件.
>
> 其他:
>
> 1. 内置了cron定时任务, 每天运行两次, 不需要再单独运行定时任务.
>
> 2. ~~使用了 http://epg.51zmt.top:8000 的封面图匹配接口，请勿频繁请求，将会导致ip被封禁，建议一个星期运行一次。~~ 现在使用iptv盒子内置的台标
# 配置文件
> 
> 配置文件在第一次运行会自动生成, 容器内位置为 /app/config/
>
## 解释
    "debug_mode": 0 调试模式, 会保存下来大量日志,默认关闭,
    "main_version": "4.1.31",
    "compile_version": "2.5r",
    "host": "直播服务器地址，抓包获取",
    "port": "直播服务器端口，抓包获取",
    "mac": "机顶盒mac，抓包获取或者机顶盒贴纸获取",
    "iptv_account": "iptv账号，抓包获取或营业厅获取或者设置页面获取",
    "iptv_passwd": "这个留空",
    "stbid": "机顶盒设备id，抓包获取或者设置页面获取",
    "uuid_string": "这个留空",
    "tempkey": "抓包获得, 或者保持任意32位key即可, 数字0-9, 字母A-F",
    "default_cover_url": "若节目没有封面, 指定的默认封面地址",
    "syslog_host": "日志上报服务器地址, 如果报错就写127.0.0.1",
    "syslog_port": "日志上报服务器端口, 如果报错就写8080",
    "udpxy_host_url": "udpxy服务器播放地址前缀",
    "epg_host_url": "epg服务器地址, 理论上和上方地址一样",
    "epg_host_port": "epg服务器端口, 理论上和上方地址一样",
    "epg_during": "未来的epg时间，默认1.5天, 最好不动, 可能报错",
    "epg_before": "过去的epg时间，默认7.0天, 最好不动, 可能报错",
    "description": "欢迎使用",
    "null_description": "此节目提供商暂时没有提供导播源",
    "nullepginfo": "暂无导播信息",
    "maxcount": "100 限制每天获取的epg数量",
    "timedelay_cover_get": 100 最好不动, 可能报错,
    "timedelay_epg_get": 100 最好不动, 可能报错
    "basic_info_host": "注册管理服务器地址，抓包获取，目前发现填错好像也不影响使用"
    "basic_info_port": "注册管理服务器端口，抓包获取，目前发现填错好像也不影响使用"
## 示例参数
`
{
"debug_mode": 0,
"main_version": "4.1.37",
"compile_version": "2.9r",
"host": "192.168.49.143",
"port": "33200",
"mac": "50:01:6B:24:**:**",
"iptv_account": "ip156********@itv",
"iptv_passwd": "",
"stbid": "001003990060893016345001********",
"uuid_string": "21dba401-33c5-40de-b1d0-4f30a7f60000",
"tempkey": "768B********5AB81F642690********",
"default_cover_url": "http://10.168.1.174:8080/images/default_iptv_icon.png",
"syslog_host": "10.168.1.128",
"syslog_port": 514,
"udpxy_host_url": "http://10.168.1.174:4022/udp/",
"epg_host_url": "192.168.49.143",
"epg_host_port": "33200",
"epg_during": "1.5",
"epg_before": "7.0",
"description": "欢迎使用",
"null_description": "此节目提供商暂时没有提供导播源",
"nullepginfo": "暂无导播信息",
"maxcount": 100,
"timedelay_cover_get": 100,
"timedelay_epg_get": 100,
"basic_info_host":"192.168.4.145",
"basic_info_port":"9000"
}
`
# 运行效果
>
> https://epg.mb6.top
>
> ![example](https://cf.mb6.top/lib/images/github/582574355.png)
> ![example](https://cf.mb6.top/lib/images/github/968527825.png)
> ![example](https://cf.mb6.top/lib/images/github/yt84561g56t1g.png)
> ![example](https://cf.mb6.top/lib/images/github/4gtwedsv49eg.png)
