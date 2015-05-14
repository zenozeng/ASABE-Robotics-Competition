// sudo apt-get install libgphoto2-2-dev
// sudo apt-get install libcanberra-gtk0

// https://github.com/peterbraden/node-opencv/blob/05e42b70aa498cbae94713da1df31084090a2088/examples/coffeescript/camera.coffee

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
