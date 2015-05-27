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

// 摄像头位置，摄像头距离小树 13cm，距离地面 24cm，摄像头角度为 45度

int main()
{
    cout << "Vision Started." << endl;

    VideoCapture capture;

    for (int i = 0; i < 3; i++) {
        capture.open(i);
        if (capture.isOpened()) {
            cout << "Success to open /dev/vedio" << i << endl;
            break;
        }
    }

    if (!capture.isOpened()) {
        cout << "Fail to open /dev/vedio0, /dev/vedio1, /dev/vedio2." << endl;
        return 1;
    }

    capture.set(CV_CAP_PROP_FRAME_WIDTH, 320);
    capture.set(CV_CAP_PROP_FRAME_HEIGHT, 240);

    // create window for debug
    if (DEBUG) {
        namedWindow("frame");
    }

    while (true)
    {
        Mat frame;
        capture >> frame;

        // narrow to 1:1 rect based on height
        int width = frame.cols;
        int height = frame.rows;
        frame = frame(Rect((width - height) / 2, 0, height, height));
        width = height;

        Mat hls;
        cvtColor(frame, hls, CV_BGR2HLS);

        // HSL 通道分离
        vector<Mat> hlsChannels;
        Mat h, s;
        split(hls, hlsChannels);
        h = hlsChannels.at(0);
        s = hlsChannels.at(2);

        // http://docs.opencv.org/doc/tutorials/imgproc/threshold/threshold.html
        // 30 - 255 -> 255; 0 - 30 -> 0
        threshold(s, s, 30, 255, 0);

        // 判断树是否存在
        Rect roi_rect(0, height * 0.3, width, height * 0.7); // x, y, width, height
        Mat ROI_S = s(roi_rect);
        Mat ROI_H = h(roi_rect);

        double rate = sum(ROI)[0] / (ROI_S.rows * ROI_S.cols * 255);
        bool exists = rate > 0.1;

        cout << endl;

        cout << '{"exists": ' << exists << ", (BottomROI Rate: "<< rate << ")" << endl;

        // 若树存在，判断其颜色类型
        if (exists) {
            int count = 0;
            int hueSum = 0;
            for (int y = 0; y < ROI_S.rows; y++) {
                for (int x = 0; x < ROI_S.cols; x++) {
                    if (ROI_S.at<Vec3b>(x, y)[0] == 255) {
                        count++;
                        hueSum += ROI_H.at<Vec3b>(x, y)[0];
                    }
                }
            }
            double hue = 1.0 * hueSum / count / 255 * 360;
            string color;
            if (hue > 35 && hue < 70) {
                color = "Yellow";
            } else if (hue > 70 && hue < 240) {
                color = "Green";
            } else {
                color = "Brown";
            }
            cout << "Color: " << color << ", Ava Hue [0-360): " << hue << endl;
        }

        Scalar grey(255 * 0.1, 255 * 0.1, 255 * 0.1);

        // 上边界标示
        rectangle(frame, Point(0, height * 0.25), Point(width, height * 0.3), grey, -1, 8);

        imwrite("../console/frame.jpg", frame);

        if (DEBUG) {
            imshow("frame", frame);
            waitKey(100);
        }
    }

    return 0;
}
