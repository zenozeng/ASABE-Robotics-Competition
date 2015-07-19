#!/bin/sh

APP_PATH=`realpath \`dirname $0\``
INTERFACE=$1
PIDFILE=$APP_PATH/pids/${INTERFACE}.pid

mkdir -p $APP_PATH/pids
hostapd -B -P $PIDFILE $APP_PATH/confs/hostapd-${INTERFACE}.conf
echo "hostapd for $INTERFACE started at pid "`cat $PIDFILE` >> $APP_PATH/logs/ifuplogs
/etc/init.d/isc-dhcp-server restart

