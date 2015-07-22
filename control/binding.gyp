{
    "libraries": ["<!@(pkg-config --libs opencv)", "-lopencv_core", "-lopencv_imgproc", "-lopencv_highgui", "-lm"],
    "targets": [
        {
            "target_name" : "vision",
            "sources" : [
                "./vision.cpp"
            ],
            "include_dirs" : [
                "<!@(pkg-config --cflags opencv)",
                "<!(node -e \"require('nan')\")"
            ],
            "cflags": ["-Wall", "-O2"],
        }
    ]
}
