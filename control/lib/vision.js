// sudo apt-get install libgphoto2-2-dev
// sudo apt-get install libcanberra-gtk0

// https://github.com/peterbraden/node-opencv/blob/05e42b70aa498cbae94713da1df31084090a2088/examples/coffeescript/camera.coffee

// 由于计算性能有限，尽量减少色彩转换比如如果要求比较 HSL
// 可以将比较规则转换为 RGB 规则，然后比较 RGB，这样可以节省计算资源

var cv = require('opencv');

var camera = new cv.VideoCapture(0);

var namedWindow = new cv.NamedWindow('Video', 0);

setInterval(function() {
    camera.read(function(err, im) {
        if(im.width() > 0 && im.height() > 0) {
            namedWindow.show(im);
            namedWindow.blockingWaitKey(0, 100);
        }
    });
}, 100);
