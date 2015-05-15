#include <opencv2/opencv.hpp>
#include <opencv2/highgui/highgui.hpp>
#include <opencv2/imgproc/imgproc.hpp>
#include <iostream>
#include <stdio.h>
#include <unistd.h>

using namespace std;
using namespace cv;

// http://docs.opencv.org/modules/highgui/doc/reading_and_writing_images_and_video.html

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
        imshow("vision", frame);
        waitKey(100);
    }

    return 0;
}
