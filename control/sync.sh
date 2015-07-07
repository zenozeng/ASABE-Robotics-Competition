#!/bin/bash

rsync -rv --exclude node_modules * zju@zju:control
