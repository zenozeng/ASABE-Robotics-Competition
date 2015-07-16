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
