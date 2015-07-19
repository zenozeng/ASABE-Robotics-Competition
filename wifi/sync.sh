#!/bin/sh

rsync -rv --exclude logs --exclude confs --exclude pids * root@zju:/srv/wifi

