#!/bin/bash
cd control
./sync.sh
cd ..

cd vision
./scp.sh
cd ..

cd console
./sync.sh
cd ..
