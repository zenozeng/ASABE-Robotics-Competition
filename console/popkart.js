window.popkartMode = false;

$(function() {
    var up, down, left, right;
    var speed = 1;


    document.onkeydown = function(ev) {
        if (!window.popkartMode) {
            return;
        }
        ev.preventDefault();
        var code = ev.keyCode;
        if (code == 37) {
            left = true;
        }
        if (code == 38) {
            up = true;
        }
        if (code == 39) {
            right = true;
        }
        if (code == 40) {
            down = true;
        }
    };
    document.onkeyup = function(ev) {
        if (!window.popkartMode) {
            return;
        }
        ev.preventDefault();
        var code = ev.keyCode;
        if (code == 37) {
            left = false;
        }
        if (code == 38) {
            up = false;
        }
        if (code == 39) {
            right = false;
        }
        if (code == 40) {
            down = false;
        }
        // speed 1x - 3x
        if (code >= 49 && code <= 51) {
            speed = code - 48;
        }
        if (!left && !right && !up && !down) {
            var cmd = ";car.stop();";
            $.ajax({
                type: "POST",
                url: "/control/eval",
                processData: false,
                contentType: 'plain/text',
                data: cmd
            });
        }
    };
    $('#popkart-mode').click(function() {
        $(this).toggleClass('open');
        window.popkartMode = !window.popkartMode;
    });
    setInterval(function() {
        if (window.popkartMode) {
            var args, cmd;
            if (up) {
                args = ["true", "true", 1, 1];
            } else if (down) {
                args = ["false", "false", 1, 1];
            } else {
                args = ["true", "true", 0, 0];
            }
            if (left) {
                args[3] += 1;
            }
            if (right) {
                args[2] += 1;
            }
            args[2] *= speed;
            args[3] *= speed;
            if (left || right || up || down) {
                cmd = ";car.go(" + args.join(',') + ");";
                $.ajax({
                    type: "POST",
                    url: "/control/eval",
                    processData: false,
                    contentType: 'plain/text',
                    data: cmd
                });
            }
        }
    }, 200);

});

