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

        /////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // 判断树是否存在（亮度 K-Means, K=3）
        //
        // double kmeans(InputArray data, int K, InputOutputArray bestLabels, TermCriteria criteria,
        //               int attempts, int flags, OutputArray centers=noArray() )
        //
        // http://docs.opencv.org/modules/core/doc/clustering.html
        // http://seiya-kumada.blogspot.jp/2013/03/k-means-clustering.html
        //
        /////////////////////////////////////////////////////////////////////////////////////////////////

        height = ROI_L.rows;
        width = ROI_L.cols;

        Mat labels;
        Mat centers;

        Mat src = ROI_L;

        src.convertTo(src, CV_32F);
        kmeans(src, 2, labels,
               TermCriteria(CV_TERMCRIT_ITER|CV_TERMCRIT_EPS, 10, 0.001), 5,
               KMEANS_PP_CENTERS, centers);

        Mat new_image( src.size(), src.type() );

        cout << src.size() << endl;

        for( int y = 0; y < src.rows; y++ )
        {
            for( int x = 0; x < src.cols; x++ )
            {
                cout << "p3" << endl << flush;
                cout << labels.size() << endl;
                int cluster_idx = labels.at<int>(y + x * src.rows, 0);
                cout << "<" << cluster_idx << ">" << endl << flush;
                cout << "p4" << endl << flush;
                cout << x << "," << y << endl << flush;
                cout << centers.at<float>(cluster_idx, 0) << endl << flush;
                new_image.at<Vec3b>(y,x)[0] = centers.at<float>(cluster_idx, 0);
                cout << "p5" << endl << flush;
                // new_image.at<Vec3b>(y,x)[1] = centers.at<float>(cluster_idx, 1);
                // new_image.at<Vec3b>(y,x)[2] = centers.at<float>(cluster_idx, 2);
            }
        }

        Mat ROI_BW = new_image;

        if (DEBUG) {
            cout << "debug" << endl;
            imshow("tmp", ROI_BW);
            imshow("frame", frame);
            // imshow("roi_l", ROI_L);
            waitKey(100);
        }


        // double rate = sum(ROI_BW)[0] / (ROI_BW.rows * ROI_BW.cols * 255);

        // if (DEBUG) {
        //     cout << "rate: ";
        //     cout << rate << endl;
        // }

        // bool exists = rate > 0.15;

        // // 若树存在，判断其颜色类型
        // string color = "null";
        // double hue;

        // if (exists) {
        //     int count = 0;
        //     int hueSum = 0;
        //     for (int y = 0; y < ROI_BW.rows; y++) {
        //         for (int x = 0; x < ROI_BW.cols; x++) {
        //             if (ROI_BW.at<Vec3b>(y, x)[0] == 255) {
        //                 count++;
        //                 hueSum += ROI_H.at<Vec3b>(y, x)[0];
        //             }
        //         }
        //     }
        //     hue = 1.0 * hueSum / count / 255 * 360;

        //     if (hue > 35 && hue < 70) {
        //         color = "Yellow";
        //     } else if (hue > 70 && hue < 240) {
        //         color = "Green";
        //     } else {
        //         color = "Brown";
        //     }
        // }

        // // 获取树像素的重心位置
        // double position = 0;
        // if (exists) {
        //     int count = 0;
        //     int count_t = 0;

        //     for (int y = 0; y < ROI_BW.rows; y++) {
        //         for (int x = 0; x < ROI_BW.cols; x++) {
        //             if (ROI_BW.at<Vec3b>(y, x)[0] == 255) {
        //                 position += x;
        //                 count++;
        //             }
        //         }
        //     }

        //     position /= count;
        //     position /= ROI_BW.cols;
        // }

        // // output json
        // cout << "{";
        // cout << "\"exists\": \"" << exists << "\", ";
        // cout << "\"color\": \"" << color << "\", ";
        // cout << "\"hue\": \"" << (int) hue << "\", ";
        // cout << "\"position\": \"" << position << "\"";
        // cout << "}" << endl;
        // cout << flush;

        // Scalar grey(255 * 0.1, 255 * 0.1, 255 * 0.1);

        // imwrite("/run/shm/frame.jpg", frame);

        // if (DEBUG) {
        //     imshow("frame", frame);
        //     waitKey(100);
        // }
    }

    return 0;
}
