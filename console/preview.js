$(function() {
    var canvas = $('#frame')[0];
    var ctx = canvas.getContext('2d');
    var $status = $('#status');
    setInterval(function() {
        // update image
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
            ctx.moveTo(0, h * 0.75);
            ctx.lineTo(w, h * 0.75);
            ctx.lineWidth = 3;
            ctx.strokeStyle = "red";
            ctx.stroke();
        };
        // update info
        $.get('/status', function(data) {
            try {
                data = JSON.parse(data);
                data = JSON.stringify(data, null, 4);
            } finally {
                $status.html(data);
            }
        });
    }, 500);
});
