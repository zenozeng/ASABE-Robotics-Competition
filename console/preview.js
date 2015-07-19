$(function() {
    var canvas = $('#frame')[0];
    var ctx = canvas.getContext('2d');
    var $status = $('#status');

    var imagePending = false;
    var statusPending = false;
    setInterval(function() {
        // update image
        if (!imagePending) {
            var image = new Image();
            imagePending = true;
            image.onload = function() {
                imagePending = false;
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
            image.onerror = function() {
                imagePending = false;
            };
            image.src = "frame.jpg?_=" + Date.now();
        }
        // update info
        if (!statusPending) {
            statusPending = true;
            $.get('/status', function(data) {
                statusPending = false;
                try {
                    data = JSON.parse(data);
                    data = JSON.stringify(data, null, 4);
                } finally {
                    $status.html(data);
                }
            }).fail(function() {
                statusPending = false;
            });
        }
    }, 500);
});
