#!/bin/bash

# find out which package was broken
# ls -l /var/lib/dpkg/info | grep list | grep ' 0 '
# ls -l /var/lib/dpkg/info | grep list | grep ' 0 ' | sed 's/.\{44\}//' | sed 's/:.*$//' | sed 's/\..*$//'

echo "Try to fix: $1"

apt-get install --reinstall --download-only $1
pkg=$(ls /var/cache/apt/archives | grep "$1_" | head -n1)
dpkg -c "/var/cache/apt/archives/$pkg" | sed 's/.\{49\}//' | sed 's/ -> .*//' | sed 's/^\/$/\/\./' | sed 's/\/$//' > "/var/lib/dpkg/info/$1.list"
echo "/var/lib/dpkg/info/$1.list fixed."
