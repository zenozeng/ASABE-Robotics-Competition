// sudo apt-get install libgphoto2-2-dev

var gphoto2 = require('gphoto2');
var GPhoto = new gphoto2.GPhoto2();

GPhoto.list(function(list) {
    console.log(list);
});
