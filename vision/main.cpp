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

/**
 * Replacement for Matlab's bwareaopen()
 * Input image must be 8 bits, 1 channel, black and white (objects)
 * with values 0 and 255 respectively
 * From: http://opencv-code.com/quick-tips/code-replacement-for-matlabs-bwareaopen/
 */
// void removeSmallBlobs(cv::Mat& im, double size)
// {

//     // Only accept CV_8UC1
//     if (im.channels() != 1 || im.type() != CV_8U)
//         return;

//     // Find all contours
//     std::vector<std::vector<cv::Point> > contours;
//     cv::findContours(im.clone(), contours, CV_RETR_EXTERNAL, CV_CHAIN_APPROX_SIMPLE);

//     for (int i = 0; i < contours.size(); i++)
//     {
//         // Calculate contour area
//         double area = cv::contourArea(contours[i]);

//         // Remove small objects by drawing the contour with black color
//         if (area > 0 && area <= size)
//             cv::drawContours(im, contours, i, CV_RGB(0,0,0), -1);
//     }
// }

int main()
{
    cout << "Vision Started." << endl;

    VideoCapture capture;

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

        ////////////////////////////////////////
        //
        // 判断树是否存在
        //
        ////////////////////////////////////////

        Rect roi_rect(0, height * 0.75, width, height * 0.25); // x, y, width, height
        Mat ROI_S = s(roi_rect);
        Mat ROI_H = h(roi_rect);
        Mat ROI_L = l(roi_rect);

        Mat ROI_BW;
        // http://docs.opencv.org/doc/tutorials/imgproc/threshold/threshold.html
        // 1: Binary Inverted
        threshold(ROI_L, ROI_BW, 192, 255, 1);

        // removeSmallBlobs(ROI_BW, 1000);

        if (DEBUG) {
            imshow("roi_l", ROI_L);
            imshow("roi_bw", ROI_BW);
        }


        double rate = sum(ROI_BW)[0] / (ROI_BW.rows * ROI_BW.cols * 255);

        if (DEBUG) {
            cout << "rate: ";
            cout << rate << endl;
        }

        bool exists = rate > 0.15;

        // 若树存在，判断其颜色类型
        string color = "null";
        double hue;

        if (exists) {
            int count = 0;
            int hueSum = 0;
            for (int y = 0; y < ROI_BW.rows; y++) {
                for (int x = 0; x < ROI_BW.cols; x++) {
                    if (ROI_BW.at<Vec3b>(y, x)[0] == 255) {
                        count++;
                        hueSum += ROI_H.at<Vec3b>(y, x)[0];
                    }
                }
            }
            hue = 1.0 * hueSum / count / 255 * 360;

            if (hue > 35 && hue < 70) {
                color = "Yellow";
            } else if (hue > 70 && hue < 240) {
                color = "Green";
            } else {
                color = "Brown";
            }
        }

        // 获取树像素的重心位置
        double position = 0;
        if (exists) {
            int count = 0;
            int count_t = 0;

            cout << ROI_BW.rows << "," << ROI_BW.cols << endl;
            for (int y = 0; y < ROI_BW.rows; y++) {
                for (int x = 0; x < ROI_BW.cols; x++) {
                    if (ROI_BW.at<Vec3b>(y, x)[0] == 255) {
                        position += x;
                        count++;
                    }
                }
            }

            cout << count << endl;
            cout << count_t << endl;
            cout << position << endl;
            position /= count;
            position /= ROI_BW.cols;
        }

        cout << "{\"exists\": \"" << exists << "\", \"color\": \"" << color << "\", \"hue\": \"" << (int) hue << "\", \"position\": \"" << position << "\"}" << endl;

        Scalar grey(255 * 0.1, 255 * 0.1, 255 * 0.1);

        imwrite("../console/frame.jpg", frame);

        if (DEBUG) {
            imshow("frame", frame);
            waitKey(100);
        }
    }

    return 0;
}
