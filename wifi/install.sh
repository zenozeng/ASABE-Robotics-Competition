#!/bin/sh

APP_PATH=`realpath \`dirname $0\``
ln -s $APP_PATH /srv/wifi
cd $APP_PATH
echo "Current APP_PATH: $APP_PATH"
echo "Install wifi..."
./gen.sh
ln -sf $APP_PATH/confs/aps /etc/network/interfaces.d/aps
ln -sf $APP_PATH/wifi-up /etc/network/if-up.d/wifi-up
ln -sf $APP_PATH/wifi-down /etc/network/if-down.d/wifi-down
echo "Installation done."

