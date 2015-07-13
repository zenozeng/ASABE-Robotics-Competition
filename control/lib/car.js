require('yapcduino')({global: true});
var pins = require('./pins');
var whiteSensors = require('./white-sensors');
var head = require('./head');

var DEBUG = true;

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

Car.prototype.go = function(leftIsForward, rightIsForward, leftSpeed, rightSpeed, leftSteps, rightSteps) {
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
};

Car.prototype.forward = function() {
    log('forward');
    this.go(true, true, 1, 1);
};

Car.prototype.backward = function() {
    log('backward');
    this.go(false, false, 1, 1);
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

Car.prototype.autoForward = function() {
    var car = this;
    car.autoForwardInterval = setInterval(function() {

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

Car.prototype.stopAutoForward = function() {
    if (typeof this.autoForwardInterval !== "undefined") {
        clearInterval(this.autoForwardInterval);
    }
};

Car.prototype.turn180 = function() {
    log('turn 180');
    this.stop();
    this.go(true, false, 2, 2, 245, 245);
};

Car.prototype.turnLeft90 = function() {
    log('turn left 90');
    this.stop();
    this.go(false, true, 2, 2, 125, 125);
};

Car.prototype.turnRight90 = function() {
    log('turn right 90');
    this.stop();
    this.go(true, false, 2, 2, 125, 125);
};

// 顺时针：rotate(true)
// 就地旋转
Car.prototype.rotate = function(clockwise, steps) {
    var left = clockwise > 0;
    var right = !left;
    this.go(left, right, 0.5, 0.5, steps, steps);
};

// 就地摆正 (sync)
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
