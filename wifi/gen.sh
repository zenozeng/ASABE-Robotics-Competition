#!/bin/sh

APP_PATH=`dirname $0`

TOTAL=10

echo "Generate $TOTAL wifi networks..."

mkdir -p $APP_PATH/confs
echo > $APP_PATH/confs/aps
i=0
while [ $i -lt $TOTAL ]; do
    echo $i
    cp $APP_PATH/ap $APP_PATH/confs/ap_tmp
    sed -i "s/WLAN_INTERFACE/wlan$i/g" $APP_PATH/confs/ap_tmp
    sed -i "s/WLAN_IP/192.168.1${i}.1/g" $APP_PATH/confs/ap_tmp
    cat $APP_PATH/confs/ap_tmp >> $APP_PATH/confs/aps
    cp $APP_PATH/hostapd.conf $APP_PATH/confs/hostapd-wlan${i}.conf
    sed -i "s/WLAN_INTERFACE/wlan$i/g" $APP_PATH/confs/hostapd-wlan${i}.conf
    sed -i "s/WLAN_SSID/ZJU-Biosystems-${i}/g" $APP_PATH/confs/hostapd-wlan${i}.conf
    i=$((i+1))
done

rm $APP_PATH/confs/ap_tmp

echo "Generate: done."

