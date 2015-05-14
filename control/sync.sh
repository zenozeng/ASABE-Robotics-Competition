#!/bin/bash

rsync -rv --exclude node_modules * ubuntu@10.75.44.25:control
