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

## node.js

node.pcduino 库

## FAQ

### Install Node.js 0.10

```bash
wget http://nodejs.org/dist/v0.10.24/node-v0.10.24-linux-arm-pi.tar.gz
tar xvzf node-v0.10.24-linux-arm-pi.tar.gz
cd node-v0.10.24-linux-arm-pi
rm ChangeLog LICENSE README.md
sudo cp -R * /usr/local
```

### Install Node-gyp

```bash
sudo npm install node-gyp -g -dd
```

### add-apt-repository not found

sudo apt-get install python-software-properties

### Install g++ 4.8

```
deb http://ppa.launchpad.net/ubuntu-toolchain-r/test/ubuntu quantal main
deb-src http://ppa.launchpad.net/ubuntu-toolchain-r/test/ubuntu quantal main
```

```bash
sudo apt-get update
sudo apt-get install gcc-4.8 g++-4.8
cd /usr/bin
sudo ln -s g++-4.8 g++
sudo ln -s gcc-4.8 gcc
```

see also: http://ubuntuhandbook.org/index.php/2013/08/install-gcc-4-8-via-ppa-in-ubuntu-12-04-13-04/

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
