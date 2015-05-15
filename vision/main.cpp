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

    VideoCapture capture(0);
    cout << "Open video0." << endl;

    // for debug
    namedWindow("vision"); // create window

    while (true)
    {
        Mat frame;
        capture >> frame;

        Mat hls;
        cvtColor(frame, hls, CV_BGR2HLS);

        vector<Mat> hlsChannels;
        split(hls, hlsChannels);

        Mat h;
        h = hlsChannels.at(0);

        // GaussianBlur(edges, edges, Size(3, 3), 1.5, 1.5);
        // Canny(edges, edges, 0, 30, 3);

        imshow("vision", h);
        waitKey(100);
        // usleep(100 * 1000);
    }

    return 0;
}
