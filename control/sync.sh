#!/bin/bash

rsync -rv --exclude node_modules * ubuntu@ubuntu:control
