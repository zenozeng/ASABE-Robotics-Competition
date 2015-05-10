#!/bin/bash

rsync -rv --exclude node_modules * ubuntu@192.168.10.1:control
