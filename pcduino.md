# Pcduino 操作 log

开发板是 armhf 架构。

## 常用操作

- Ctrl + Alt + T 开启终端

- `df -hl` 以查看剩余空间

## date

```bash
date -s 04/13/2015
date -s 16:08:00
hwclock -w # 强制写入 CMOS，否则同步到 CMOS 是要一定时间的
```

See also: http://blog.csdn.net/jk110333/article/details/8590746

See also: http://manpages.ubuntu.com/manpages/gutsy/man8/clock.8.html

## OTG

这个 OTG 好像插在电脑上可以被识别用的。
而且在我的测试中没有带动鼠标。

## 图形界面控制

```bash
echo "manual" | sudo tee -a /etc/init/lxdm.override
```

```bash
sudo stop lxdm # 关闭
sudo start lxdm # 打开
sudo restart lxdm # 重启
echo manual | sudo tee /etc/init/lxdm.override # 禁用lxdm自启动
```

## Disable auto root login

vi /bin/auto-root-login

注释掉代码。

## FAQ

## 网络架构

- （可选）pcduino 插内网网线

- 发射无线信号作为通讯用

### pc机

```
sslocal -c jp.zenozeng.com.json -b 0.0.0.0
```

### SSH 隧道

```
-R [bind_address:]port:host:hostport
```

## NPM

```bash
npm config set registry http://mirrors.zju.edu.cn/npm
```
