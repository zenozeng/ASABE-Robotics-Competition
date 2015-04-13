# Pcduino 操作 log

## SSH

```bash
cd ~/.ssh
echo 'YOUR PUB KEY' > authorized_keys
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
sudo stop lightdm # 关闭
sudo start lightdm # 打开
sudo restart lightdm # 重启
```

## Node.js

node.pcduino 库
