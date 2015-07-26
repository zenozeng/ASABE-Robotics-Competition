#!/bin/bash

rsync -rv --exclude node_modules --exclude build * zju@zju:control
