#!/bin/sh

APP_PATH=`realpath \`dirname $0\``
INTERFACE=$1

kill -9 $APP_PATH/pids/${INTERFACE}.pid
echo "hostapd for $INTERFACE killed at pid "`cat $APP_PATH/pids/${INTERFACE}.pid` >> $APP_PATH/logs/ifuplogs

