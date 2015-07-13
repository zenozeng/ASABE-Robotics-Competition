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

Car.prototype.turnLeft = function() {
    log('turn left');
    this.go(true, true, 0, 1);
};

Car.prototype.turnRight = function() {
    log('turn right');
    this.go(true, true, 1, 0);
};

Car.prototype.autoForward = function() {
    var car = this;
    car.autoForwardInterval = setInterval(function() {

        var dir = head.getBlackLineDirection();
        if (dir > 0) {
            car.turnRight();
        } else if (dir < 0) {
            car.turnLeft();
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
    this.go(left, right, 2, 2, steps, steps);
};

// 就地摆正 (sync)
Car.prototype.straighten = function() {
    log('straighten');
    var car = this;
    car.stop();
    var interval = setInterval(function() {
        var dir = head.getBlackLineDirection();
        if (dir != 0) {
            var clockwise = dir > 0;
            car.rotate(clockwise);
        } else {
            clearInterval(interval);
        }
    }, 20);
};

var car = new Car();

module.exports = car;
