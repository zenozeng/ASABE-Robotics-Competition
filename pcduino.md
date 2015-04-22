# Pcduino 操作 log

## 常用操作

- Ctrl + Alt + T 开启终端

- `df -hl` 以查看剩余空间

## SSH

```bash
cd ~/.ssh
echo 'YOUR PUB KEY' > authorized_keys
```

```bash
sudo apt-get install mosh
```

## proxychains

开发板是 armhf 架构。

http://ports.ubuntu.com/pool/universe/p/proxychains/

## Editor

```bash
sudo apt-get install emacs23-nox
```

## Wifi

sudo iwlist scanning

## AP

```bash
sudo apt-get install git
```

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
echo "manual" | sudo tee -a /etc/init/lightdm.override
```

```bash
sudo stop lightdm # 关闭
sudo start lightdm # 打开
sudo restart lightdm # 重启
```

## Disable auto root login

vi /bin/auto-root-login

注释掉代码。

## Node.js

node.pcduino 库
