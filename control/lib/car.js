require('yapcduino')({global: true});
var pins = require('./pins');
var whiteSensors = require('./white-sensors');
var head = require('./head');

var STEPS_FOR_90_DEG_SPEED_0_1 = 240;
var STEPS_FOR_90_DEG_SPEED_1_2 = STEPS_FOR_90_DEG_SPEED_0_1 * 2;
var STEPS_FOR_A_BLOCK = 360; // TODO
var STEPS_FOR_A_TREE_BLOCK = 360; // TODO

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
    this.steps = 0;
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
    if (steps) {
        this.steps += steps;
    }
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
            car.steps += car.getCurrentSteps();
            car.go(true, true, speed[dir][0], speed[dir][1]);
        } else {
            car.steps += car.getCurrentSteps();
            car.forward();
        }

    }, 20);
};

// Get current steps since last write
Car.prototype.getCurrentSteps = function() {
    return (leftMotor.getLoopCount() + rightMotor.getLoopCount()) / 2;
};

// steps for current forward task
Car.prototype.getSteps = function() {
    return this.steps + this.getCurrentSteps();
};

// Tree index for current position of current forward task
// Index starts from 1
Car.prototype.getTreeIndex = function() {
    return parseInt(this.getSteps() / STEPS_FOR_A_TREE_BLOCK) + 1;
};

Car.prototype.resetSteps = function() {
    this.steps = 0;
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

Car.prototype.turn180 = function(rightFirst, offsetBlocks) {
    log('turn 180');
    this.stop();
    var steps = STEPS_FOR_90_DEG_SPEED_1_2;
    var sync = true;
    this.go(true, true, 1, 1, 100, 100, sync);
    if (rightFirst) {
        this.go(true, true, 2, 1, steps, steps / 2, sync);
        this.go(false, false, 2, 2, steps, steps, sync);
        this.go(false, false, 1, 1,
                STEPS_FOR_A_BLOCK * offsetBlocks,
                STEPS_FOR_A_BLOCK * offsetBlocks,
                sync);
        this.go(true, true, 2, 1, steps, steps / 2, sync);
    } else {
        this.go(true, true, 1, 2, steps / 2, steps, sync);
        this.go(false, false, 2, 2, steps, steps, sync);
        this.go(false, false, 1, 1,
                STEPS_FOR_A_BLOCK * offsetBlocks,
                STEPS_FOR_A_BLOCK * offsetBlocks,
                sync);
        this.go(true, true, 1, 2, steps / 2, steps, sync);
    }
    this.go(true, true, 1, 1, 100, 100, sync);
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

var car = new Car();

module.exports = car;
