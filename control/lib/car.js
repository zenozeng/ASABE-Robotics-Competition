require('yapcduino')({global: true});
var pins = require('./pins');
var whiteSensors = require('./white-sensors');
var head = require('./head');

var DEBUG = false;

var log = function(message) {
    if (DEBUG) {
        console.log('lib/car.js: ' + message);
    }
};

var left = {clk: pins.LEFT_STEPPING_MOTOR_CLK, cw: pins.LEFT_STEPPING_MOTOR_CW};
var right = {clk: pins.RIGHT_STEPPING_MOTOR_CLK, cw: pins.RIGHT_STEPPING_MOTOR_CW};

// init pinMode
[left.clk, left.cw, right.clk, right.cw].forEach(function(pin) {
    pinMode(pin, OUTPUT);
});

var leftMotor = new SoftPWM(left.clk);
var rightMotor = new SoftPWM(right.clk);

function Car() {
    this.distance = 0;
}

Car.prototype.stop = function() {
    leftMotor.write(0);
    rightMotor.write(0);
};

Car.prototype.go = function(leftIsForward, rightIsForward, leftSpeed, rightSpeed, leftSteps, rightSteps, sync) {
    // 设置方向
    var leftCW = leftIsForward ? HIGH : LOW; // 左轮向前为顺时针
    var rightCW = rightIsForward ? LOW : HIGH; // 右轮向前为逆时针
    digitalWrite(left.cw, leftCW);
    digitalWrite(right.cw, rightCW);

    // 设置速度
    var period = 10000;
    var motors = [leftMotor, rightMotor];
    var loops = [leftSteps, rightSteps];
    [leftSpeed, rightSpeed].forEach(function(speed, index) {
        if (speed === 0) {
            motors[index].write(0);
        } else {
            motors[index].write(0.5, {
                period: parseInt(period / speed),
                loops: loops[index]
            });
        }
    });
    if (sync) {
        motors.forEach(function(motor) {
            motor.sync(); // wait all pwm thread finish its work
        });
    }
};

Car.prototype.forward = function(steps) {
    log('forward');
    this.go(true, true, 1, 1, steps, steps);
};

Car.prototype.backward = function(steps) {
    log('backward');
    this.go(false, false, 1, 1, steps, steps);
};

Car.prototype.turnLeft = function(speed) {
    speed = speed === undefined ? 1 : speed;
    log('turn left, speed: ' + speed);
    this.go(true, true, speed * 0.5, speed);
};

Car.prototype.turnRight = function(speed) {
    speed = speed === undefined ? 1 : speed;
    log('turn right, speed: ' + speed);
    this.go(true, true, speed, speed * 0.5);
};

Car.prototype.auto = function(forward) {
    forward ? this.autoForward() : this.autoBackward();
};

Car.prototype.autoForward = function() {
    log('auto forward');
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
            car.go(true, true, speed[dir][0], speed[dir][1]);
        } else {
            car.forward();
        }

    }, 20);
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

Car.prototype.isAuto = function() {
    return typeof this.autoInterval !== "undefined";
};

Car.prototype.stopAuto = function() {
    if (typeof this.autoInterval !== "undefined") {
        clearInterval(this.autoInterval);
    }
    this.autoInterval = undefined;
};

var STEPS_FOR_90_DEG_SPEED_0_1 = 240;
var STEPS_FOR_90_DEG_SPEED_1_2 = STEPS_FOR_90_DEG_SPEED_0_1 * 2;

Car.prototype.turn180 = function(rightFirst) {
    log('turn 180');
    this.stop();
    var steps = STEPS_FOR_90_DEG_SPEED_1_2;
    var sync = true;
    if (rightFirst) {
        this.go(true, true, 2, 1, steps, steps / 2, sync);
        this.go(false, false, 2, 2, steps, steps, sync);
        this.go(true, true, 2, 1, steps, steps / 2, sync);
    } else {
        this.go(true, true, 1, 2, steps / 2, steps, sync);
        this.go(false, false, 2, 2, steps, steps, sync);
        this.go(true, true, 1, 2, steps / 2, steps, sync);
    }
};

// 左轮不动
Car.prototype.turnLeft90Sync = function() {
    log('turn left 90');
    this.stop();
    var steps = STEPS_FOR_90_DEG_SPEED_0_1;
    this.go(true, true, 0, 1, steps, steps, true);
};

// 右轮不动
Car.prototype.turnRight90Sync = function() {
    log('turn right 90');
    this.stop();
    var steps = STEPS_FOR_90_DEG_SPEED_0_1;
    this.go(true, true, 1, 0, steps, steps, true);
};

// // 顺时针：rotate(true)
// // 就地旋转
// Car.prototype.rotate = function(clockwise, steps) {
//     var left = clockwise > 0;
//     var right = !left;
//     this.go(left, right, 0.1, 0.1, steps, steps);
// };

// // 就地摆正 (sync)
// Car.prototype.straighten = function() {
//     log('straighten');
//     var car = this;
//     car.stop();
//     var mark = false;
//     var interval = setInterval(function() {
//         var dir = head.getBlackLineDirection();
//         log(dir);
//         if (dir != 0) {
//             var clockwise = dir > 0;
//             car.rotate(clockwise);
//             mark = false;
//         } else {
//             // 连续两次才停止
//             if (mark) {
//                 clearInterval(interval);
//             } else {
//                 mark = true;
//             }
//         }
//     }, 100);
// };

var car = new Car();

module.exports = car;
