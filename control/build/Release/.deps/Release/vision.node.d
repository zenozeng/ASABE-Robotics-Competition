cmd_Release/vision.node := ln -f "Release/obj.target/vision.node" "Release/vision.node" 2>/dev/null || (rm -rf "Release/vision.node" && cp -af "Release/obj.target/vision.node" "Release/vision.node")
