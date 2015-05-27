#!/bin/bash

rsync -rv --exclude node_modules * linaro@zjubio:control
