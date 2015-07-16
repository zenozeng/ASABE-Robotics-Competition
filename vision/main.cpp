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

        bool exists = stddev > 25;

        Mat ROI_BW;
        threshold(src, ROI_BW, 0, 255, CV_THRESH_BINARY | CV_THRESH_OTSU);
        bitwise_not(ROI_BW, ROI_BW);

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

            // hue: 0 - 360
            // Brown: 12
            // Yellow (Sun Gloss Yellow): 46
            // Green (Gloss Hosta Leaf): 78

            int green = hue - 78;
            int yellow = hue - 46;
            int brown = hue - 12;

            green = green > 180 ? 360 - green : green;
            yellow = yellow > 180 ? 360 - yellow : yellow;
            brown = brown > 180 ? 360 - brown : brown;

            if (brown < yellow && brown < green) {
                color = "Brown";
            }

            if (yellow < green && yellow < brown) {
                color = "Yellow";
            }

            if (green < yellow && green < brown) {
                color = "Green";
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

        cout << "{";
        cout << "\"exists\": \"" << exists << "\", ";
        cout << "\"color\": \"" << color << "\", ";
        cout << "\"stddev\": \"" << stddev << "\", ";
        cout << "\"hue\": \"" << (int) hue << "\", ";
        cout << "\"position\": \"" << position << "\"";
        cout << "}" << endl;
        cout << flush;

        imwrite("/run/shm/frame.jpg", frame);

        if (DEBUG) {
            imshow("frame", frame);
            imshow("ROI_BW", ROI_BW);
            imshow("ROI_L", ROI_L);
            waitKey(100);
        }
    }

    return 0;
}
