#include <opencv2/opencv.hpp>
#include <opencv2/highgui/highgui.hpp>
#include <opencv2/imgproc/imgproc.hpp>
#include <iostream>
#include <stdio.h>
#include <unistd.h>

using namespace std;
using namespace cv;

// http://docs.opencv.org/modules/highgui/doc/reading_and_writing_images_and_video.html
// 分离颜色通道&多通道图像混合：http://blog.csdn.net/poem_qianmo/article/details/21176257

// 摄像头共两个，在小车两侧的边缘底部挂着。接近地面。摄像头距离小树轴心 16cm。
// https://github.com/zenozeng/ASABE-Robotics-Competition/issues/61

int main()
{
    cout << "Vision Started." << endl;

    VideoCapture capture(0);
    if (capture.isOpened()) {
        cout << "Video opened." << endl;
    } else {
        cout << "Fail to open video" << endl;
        return -1;
    }

    // create window for debug
    namedWindow("frame");
    namedWindow("h");
    namedWindow("s");
    namedWindow("l");

    while (true)
    {
        Mat frame;
        capture >> frame;

        imshow("frame", frame);

        Mat hls;
        cvtColor(frame, hls, CV_BGR2HLS);

        vector<Mat> hlsChannels;
        split(hls, hlsChannels);

        Mat h, s, l;
        h = hlsChannels.at(0);
        l = hlsChannels.at(1);
        s = hlsChannels.at(2);

        // GaussianBlur(edges, edges, Size(3, 3), 1.5, 1.5);
        // Canny(edges, edges, 0, 30, 3);



        // http://docs.opencv.org/doc/tutorials/imgproc/threshold/threshold.html
        /* 0: Binary
           1: Binary Inverted
           2: Threshold Truncated
           3: Threshold to Zero
           4: Threshold to Zero Inverted
        */
        // 30 - 255 -> 255
        // 0 - 30 -> 0
        threshold(s, s, 30, 255, 0);

        // imshow("h", h);
        // imshow("s", s);
        // imshow("l", l);
        waitKey(100);
        // usleep(100 * 1000);
    }

    return 0;
}
