// 顺时针：rotate(true)
// 就地旋转
Car.prototype.rotate = function(clockwise, steps) {
    var left = clockwise > 0;
    var right = !left;
    this.go(left, right, 0.1, 0.1, steps, steps);
};

// 就地摆正 (sync)
Car.prototype.straighten = function() {
    log('straighten');
    var car = this;
    car.stop();
    var mark = false;
    var interval = setInterval(function() {
        var dir = head.getBlackLineDirection();
        log(dir);
        if (dir != 0) {
            var clockwise = dir > 0;
            car.rotate(clockwise);
            mark = false;
        } else {
            // 连续两次才停止
            if (mark) {
                clearInterval(interval);
            } else {
                mark = true;
            }
        }
    }, 100);
};

// Buggy! untested.
Car.prototype.autoBackward = function() {
    log('auto backward');
    var car = this;
    car.stopAuto();
    car.autoInterval = setInterval(function() {

        var dir = head.getBlackLineDirection();
        var speed = {
            "-1": [0.8, 1],
            "-2": [0.5, 1],
            "1": [1, 0.8],
            "2": [1, 0.5]
        };
        if (dir != 0) {
            car.go(false, false, speed[dir][0], speed[dir][1]);
        } else {
            car.backward();
        }

    }, 20);
};
