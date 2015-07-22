{
    "targets": [
        {
            "target_name" : "vision",
            "libraries": ["-lopencv_core", "-lopencv_imgproc", "-lopencv_highgui", "-lm"],
            "sources" : [
                "./vision.cpp"
            ],
            "include_dirs" : [
                "<!(node -e \"require('nan')\")"
            ],
            "cflags": ["-Wall", "-O2"],
        }
    ]
}
