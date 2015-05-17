# Installed Packages

## Dev

### g++ 4.8

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

## opencv2.3

```
sudo apt-get install libopencv-dev
```
