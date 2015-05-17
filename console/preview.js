$(function() {
    var canvas = $('#frame')[0];
    var ctx = canvas.getContext('2d');
    var display = function() {
        var image = new Image();
        image.src = "frame.jpg?_=" + Date.now();
        image.onload = function() {
            var w = image.width;
            var h = image.height;
            if (canvas.width !== w) {
                canvas.width = w;
            }
            if (canvas.height !== h) {
                canvas.height = h;
            }
            ctx.drawImage(image, 0, 0, w, h);
            setTimeout(display, 500);
        };
        image.onerror = function() {
            display();
        };
    };
    display();
});
