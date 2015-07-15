window.popkartMode = false;

$(function() {
    var up, down, left, right;

    document.onkeydown = function(ev) {
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
            }
            if (up || down) {
                if (left) {
                    args[2] *= 2;
                }
                if (right) {
                    args[3] *= 2;
                }
                cmd = ";car.go(" + args.join(',') + ");";
            } else {
                cmd = ";car.stop();";
            }
            $.ajax({
                type: "POST",
                url: "/control/eval",
                processData: false,
                contentType: 'plain/text',
                data: cmd
            });
        }
    }, 200);

});

