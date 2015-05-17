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

#define DEBUG true

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
    if (DEBUG) {
        namedWindow("frame");
        namedWindow("roi-bottom-s");
        namedWindow("roi-top-s");
    }

    while (true)
    {
        Mat frame;
        capture >> frame;

        Mat hls;
        cvtColor(frame, hls, CV_BGR2HLS);

        vector<Mat> hlsChannels;
        split(hls, hlsChannels);

        Mat h, s, l;
        h = hlsChannels.at(0);
        s = hlsChannels.at(2);

        // http://docs.opencv.org/doc/tutorials/imgproc/threshold/threshold.html
        // 30 - 255 -> 255; 0 - 30 -> 0
        threshold(s, s, 30, 255, 0);

        int height = s.rows;
        int width = s.cols;

        // 判断树是否存在
        Rect bottom(width * 0.1, height * 0.75, width * 0.8, height * 0.24); // x, y, width, height
        Mat bottomROI = s(bottom);

        double rate = sum(bottomROI)[0] / (bottomROI.rows * bottomROI.cols * 255);
        bool exists = rate > 0.1;

        cout << endl;
        cout << "<Tree Detect Loop>" << endl;

        cout << "Tree Exists? " << exists << ", (BottomROI Rate: "<< rate << ")" << endl;

        // 若树存在，判断其颜色类型
        if (exists) {
            int count = 0;
            int hueSum = 0;
            for (int y = 0; y < bottomROI.rows; y++) {
                for (int x = 0; x < bottomROI.cols; x++) {
                    if (s.at<Vec3b>(x, y)[0] == 255) {
                        count++;
                        hueSum += h.at<Vec3b>(x, y)[0];
                    }
                }
            }
            double hue = 1.0 * hueSum / count / 255 * 360;
            string color;
            if (hue > 35 && hue < 75) {
                color = "Yellow";
            } else if (hue > 75 && hue < 240) {
                color = "Green";
            } else {
                color = "Brown";
            }
            cout << "Color: " << color << ", Ava Hue [0-360): " << hue << endl;
        }

        // 若树存在，判断高矮
        if (exists) {
            Rect top(width * 0.1, height * 0.2, width * 0.8, height * 0.05);
            Mat topROI = s(top);
            double topROIRate = sum(topROI)[0] / (topROI.rows * topROI.cols * 255);
            bool isHigh = topROIRate > 0.1;
            cout << "Tree is High? " << isHigh << ", (TopROI Rate: " << topROIRate << ")" << endl;

            if (DEBUG) {
                imshow("roi-top-s", topROI);
            }
        }

        if (DEBUG) {
            Scalar grey(255 * 0.1, 255 * 0.1, 255 * 0.1);
            // 下边界标示
            rectangle(frame, Point(0, height * 0.65), Point(width, height * 0.75), grey, -1, 8);
            // 上边界标示
            rectangle(frame, Point(0, height * 0.25), Point(width, height * 0.3), grey, -1, 8);
            rectangle(frame, Point(0, height * 0.15), Point(width, height * 0.2), grey, -1, 8);

            // 左右边界
            rectangle(frame, Point(width * 0.08, 0), Point(width * 0.1, height), grey, -1, 8);
            rectangle(frame, Point(width * 0.9, 0), Point(width * 0.92, height), grey, -1, 8);

            imshow("frame", frame);
            imshow("roi-bottom-s", bottomROI);
        }
        waitKey(100);
    }

    return 0;
}
