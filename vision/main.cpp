#include <opencv2/opencv.hpp>
#include <opencv2/highgui/highgui.hpp>
#include <opencv2/imgproc/imgproc.hpp>
#include <iostream>
#include <fstream>
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

using namespace std;
using namespace cv;

// http://docs.opencv.org/modules/highgui/doc/reading_and_writing_images_and_video.html
// 分离颜色通道&多通道图像混合：http://blog.csdn.net/poem_qianmo/article/details/21176257

int main()
{
    cout << "Vision Started." << endl;

    VideoCapture capture;

    ofstream file;

    for (int i = 0; i < 3; i++) {
        capture.open(i);
        if (capture.isOpened()) {
            cout << "Success to open /dev/video" << i << endl;
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

        ////////////////////////////////////////
        //
        // 准备工作
        //
        ////////////////////////////////////////

        // narrow to 1:1 square based on height
        int width = frame.cols;
        int height = frame.rows;
        frame = frame(Rect((width - height) / 2, 0, height, height));
        width = height;

        Mat hls;
        cvtColor(frame, hls, CV_BGR2HLS);

        // HSL 通道分离
        vector<Mat> hlsChannels;
        Mat h, l, s;
        split(hls, hlsChannels);
        h = hlsChannels.at(0);
        l = hlsChannels.at(1);
        s = hlsChannels.at(2);

        Rect roi_rect(0, height * 0.75, width, height * 0.25); // x, y, width, height
        Mat ROI_S = s(roi_rect);
        Mat ROI_H = h(roi_rect);
        Mat ROI_L = l(roi_rect);

        /////////////////////////////////////////
        //
        // 判断树是否存在（整体方差 > magicValue）
        //
        /////////////////////////////////////////

        Mat src = ROI_L;
        Scalar mean_scalar;
        Scalar stddev_scalar;

        meanStdDev(src, mean_scalar, stddev_scalar);
        double mean = mean_scalar.val[0];
        double stddev = stddev_scalar.val[0];

        // bool exists = stddev > 25;
        bool exists = true;

        Mat ROI_L_BW;
        threshold(ROI_L, ROI_L_BW, 0, 255, CV_THRESH_BINARY | CV_THRESH_OTSU); // OTSU
        // 反色
        bitwise_not(ROI_L_BW, ROI_L_BW);

        // 将 hue 整体右移 120，（240 -> 360, 0 -> 120），
        // 这样红色会连接在一起
        Mat ROI_H2 = ROI_H.clone();
        for (int y = 0; y < ROI_H2.rows; y++) {
            for (int x = 0; x < ROI_H2.cols; x++) {
                int hue = ROI_H2.at<uchar>(y, x);
                hue += 255 / 3;
                if (hue > 255) {
                    hue -= 255;
                }
                ROI_H2.at<uchar>(y, x) = hue;
            }
        }

        Mat ROI_H_BW;
        threshold(ROI_H2, ROI_H_BW, 0, 255, CV_THRESH_BINARY | CV_THRESH_OTSU); // OTSU
        bitwise_not(ROI_H_BW, ROI_H_BW);

        Mat ROI_BW;
        bitwise_and(ROI_L_BW, ROI_H_BW, ROI_BW);

        ///////////////////////////////////
        //
        // 若树存在，判断其颜色类型
        //
        ///////////////////////////////////

        string color = "null";
        double hue;
        double saturation;

        // 将 hue 整体右移 120，（240 -> 360, 0 -> 120），
        // 这样红色会连接在一起
        Mat ROI_H3 = ROI_H2.clone();
        for (int y = 0; y < ROI_H3.rows; y++) {
            for (int x = 0; x < ROI_H3.cols; x++) {
                if (ROI_BW.at<uchar>(y, x) != 255) {
                    ROI_H3.at<uchar>(y, x) = 255;
                }
            }
        }

        if (exists) {
            int count = 0;
            int hueSum = 0;
            int sSum = 0;
            for (int y = 0; y < ROI_BW.rows; y++) {
                for (int x = 0; x < ROI_BW.cols; x++) {
                    if (ROI_BW.at<Vec3b>(y, x)[0] == 255) {
                        count++;
                        hueSum += ROI_H2.at<Vec3b>(y, x)[0];
                        sSum += ROI_S.at<Vec3b>(y, x)[0];
                    }
                }
            }
            hue = 1.0 * hueSum / count / 255 * 360;
            saturation = 1.0 * sSum / count;

            // hue: 0 - 360
            // Brown: (Gloss Leather Brown Spray Paint, HSL: 12, 19, 27)，右移后为 132
            // Yellow (Gloss Sun Yellow Spray Paint, HSL: 46, 91, 50)，右移后为 166
            // Green (Gloss Hosta Leaf Spray Paint, HSL: 78, 43, 27)，右移后为 198

            // 由于实际测试中我们的棕色木块色相可以接近三四十，会导致误判为黄色
            // 所以我们结合饱和度信息

            int p1 = (12 + 46) / 2 + 120;
            int p2 = (46 + 78) / 2 + 120;

            if (hue < p1) {
                color = "Brown";
            } else if (hue > p2) {
                color = "Green";
            } else {
                color = "Yellow";
            }
        }

        // 获取树像素的重心位置
        double position = 0;
        if (exists) {
            int count = 0;
            int count_t = 0;

            for (int y = 0; y < ROI_BW.rows; y++) {
                for (int x = 0; x < ROI_BW.cols; x++) {
                    if (ROI_BW.at<Vec3b>(y, x)[0] == 255) {
                        position += x;
                        count++;
                    }
                }
            }

            position /= count;
            position /= ROI_BW.cols;
        }

        ////////////////////////////
        //
        // Output JSON & image
        //
        ////////////////////////////

        stringstream json;
        json << "{";
        json << "\"exists\": \"" << exists << "\", ";
        json << "\"color\": \"" << color << "\", ";
        // cout << "\"stddev\": \"" << stddev << "\", ";
        json << "\"hue\": \"" << hue << "\", ";
        json << "\"saturation\": \"" << saturation << "\", ";
        json << "\"position\": \"" << position << "\"";
        json << "}" << endl;

        if (DEBUG) {
            cout << json.str();
        }
        cout << "Sync to /run/shm/vision.jpg" << endl;
        imwrite("/run/shm/vision.jpg", frame);

        cout << "Sync to /run/shm/vision.json" << endl;
        file.open ("/run/shm/vision.json", ios::out | ios::trunc);
        file << json.str();
        file.close();

        if (DEBUG) {
            imshow("frame", frame);
            imshow("ROI_BW", ROI_BW);
            imshow("ROI_H", ROI_H);
            imshow("ROI_H2", ROI_H2);
            imshow("ROI_S", ROI_S);
            imshow("ROI_L", ROI_L);
        }
        waitKey(100);

        usleep(100 * 1000);
    }

    return 0;
}
