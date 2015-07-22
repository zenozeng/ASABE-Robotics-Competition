require('yapcduino')({global: true});
var pins = require('./pins');
var whiteSensors = require('./white-sensors');
var head = require('./head');

var STEPS_FOR_90_DEG_SPEED_0_1 = 240 * 16;
var STEPS_FOR_90_DEG_SPEED_1_2 = STEPS_FOR_90_DEG_SPEED_0_1 * 2;
var STEPS_FOR_A_BLOCK = 8125;
var STEPS_FOR_A_TREE_BLOCK = 3700;

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
    this.steps += this.getCurrentSteps();
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
    var period = 10000 / 16;
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

Car.prototype._autoForward = function(speedScale) {
    if (typeof speed == "undefined") {
        speedScale = 1;
    }
    var dir = head.getBlackLineDirection();
    // console.log({dir: dir});
    var isCrossing = head.isCrossing();
    var speed = {
        "-1": [0.8, 1],
        "-2": [0.5, 1],
        "-3": [0, 1],
        "1": [1, 0.8],
        "2": [1, 0.5],
        "3": [1, 0]
    };
    if (dir != 0 && !isCrossing) {
        car.steps += car.getCurrentSteps();
        car.go(true, true, speed[dir][0] * speedScale, speed[dir][1] * speedScale, 1000, 1000);
    } else {
        car.steps += car.getCurrentSteps();
        car.go(true, true, 1 * speedScale, 1 * speedScale);
    }
};

Car.prototype.autoForwardSync = function(steps, speedScale) {
    console.log('Auto Forward Sync: ', steps, 'steps.');
    var targetSteps = this.getSteps() + steps;
    var ret = false;
    while (this.getSteps() < targetSteps) {
        if (head.isCrossing()) {
            ret = true;
        }
        this._autoForward(speedScale);
    }
    this.stop();
    console.log('Auto Forward Sync done.');
    return ret;
};

Car.prototype.autoForwardAutoStopSync = function(steps) {
    console.log('Auto Forward Auto Stop Sync: ', steps, 'steps.');
    var targetSteps = this.getSteps() + steps;
    while (this.getSteps() < targetSteps) {
        if (head.isCrossing()) {
            break;
        }
        this._autoForward();
    }
    this.stop();
    console.log('Auto Forward Auto Stop Sync done.');
};

// Get current steps since last write
Car.prototype.getCurrentSteps = function() {
    var loops = [leftMotor.getLoopCount(), rightMotor.getLoopCount()].map(function(loops) {
        if (loops > 10 * 10000 * 10000) {
            return 0;
        }
        return Math.max(loops, 0);
    });
    return (loops[0] + loops[1]) / 2;
};

// steps for current forward task
Car.prototype.getSteps = function() {
    return this.steps + this.getCurrentSteps();
};

// Tree index for current position of current forward task
// Note: Index starts from 1
Car.prototype.getTreeIndex = function() {
    var y = this.getSteps();
    var x = (y - 809.5) / 3977.5;
    x = Math.min(x, 5);
    x = Math.max(x, 1);
    return Math.round(x);
};

Car.prototype.resetSteps = function() {
    this.steps = 0;
};

// forwardBlocks(1)
// forwardBlocks(2)
// 走在黑线上时调用
Car.prototype.forwardBlocks = function(blocks) {
    var steps = STEPS_FOR_90_DEG_SPEED_0_1;
    car.go(false, false, 0.5, 0.5, 1000, 1000, true);
    car.go(true, true, 0.25, 0.5, steps, steps * 2, true);
    car.go(true, true, 0.5, 0.5, 480, 480, true);
    var offset = blocks - 1;
    car.go(true, true, 0.5, 0.5, STEPS_FOR_A_BLOCK * offset + 1, STEPS_FOR_A_BLOCK * offset + 1, true);
    car.go(true, true, 0.25, 0.5, steps, steps * 2, true);
    car.rotateToFindLine(15);
};

Car.prototype.turn180 = function(rightFirst, offsetBlocks) {
    log('turn 180');
    var steps = STEPS_FOR_90_DEG_SPEED_0_1;
    this.stop();
    car = this;
    // 先出来一点
    car.go(true, true, 0.25, 0.25, steps * 0.7, steps * 0.7, true);
    if (rightFirst) {
        // 右轮不动，向右转出 30°
        car.go(true, true, 0.25, 0, steps / 3, 0, true);
        // 左右轮齐动，向右 60°
        car.go(true, false, 0.25, 0.25, steps / 3, steps / 3, true);
    } else {
        // 左轮不动，向左转出 30°
        car.go(true, true, 0, 0.25, 0, steps / 3, true);
        // 左右轮齐动，再转 60°
        car.go(false, true, 0.25, 0.25, steps / 3, steps / 3, true);
    }
    car.go(false, false, 0.5, 0.5, steps * 1, steps * 1, true);
    var blockSteps = STEPS_FOR_A_BLOCK * offsetBlocks;
    car.go(blockSteps < 0, blockSteps < 0, 0.5, 0.5,
           Math.abs(blockSteps) + 1, // because 0 will be ignored and will go forever, so use >= 1
           Math.abs(blockSteps) + 1,
           true);
    if (rightFirst) {
        car.go(true, true, 0.5, 0.25, steps * 2, steps, true);
    } else {
        car.go(true, true, 0.25, 0.5, steps, steps * 2, true);
    }
    car.rotateToFindLine(15);
};

// cw 是否先顺时针
Car.prototype.rotateToFindLine = function(deg, cw) {
    var car = this;
    var steps = STEPS_FOR_90_DEG_SPEED_0_1;
    car.stop();

    steps = steps / 6 * (deg / 30);

    // 先转 deg
    car.go(cw, !cw, 0.25, 0.25, steps, steps, true);
    // 接下来反向旋转 2 * deg 度去寻找黑线 (async)
    car.go(!cw, cw, 0.25, 0.25, steps * 2, steps * 2);

    var timeout = 5 * 1000;
    var done = false;

    // 先尝试两点检测
    var now = Date.now();
    while ((Date.now() - now) < timeout) {
        var sensors = head.read();
        if (sensors[0] + sensors[1] < 1) { // 如果有两片都找到黑色那么就好噜
            done = true;
            car.stop();
            break;
        }
    }

    // 再尝试单点检测
    if (!done) {
        // 先转 deg
        car.go(cw, !cw, 0.25, 0.25, steps, steps, true);
        // 接下来反向旋转 2 * deg 度去寻找黑线 (async)
        car.go(!cw, cw, 0.25, 0.25, steps * 2, steps * 2);

        now = Date.now();
        while ((Date.now() - now) < timeout) {
            sensors = head.read();
            if (sensors[0] + sensors[1] < 2) { // 如果有片找到黑色那么就好噜
                car.stop();
                break;
            }
        }
    }

    car.autoForwardSync(2000);

    while(true) {
        // car.go(false, false, 0.25, 0.25, 1000, 1000);
        car.go(false, false, 0.5, 0.5, 1000, 1000);
        // console.log(head.isCrossing());
        if (head.isCrossing()) {
            car.stop();
            break;
        }
    }

    while(head.isCrossing()) {
        car.go(true, true, 0.25, 0.25, 1000, 1000);
    }
    car.stop();
};

Car.prototype.goBack = function() {
    var car = this;
    var steps = STEPS_FOR_90_DEG_SPEED_0_1;
    car.forwardBlocks(2);
    // car.go(false, false, 0.25, 0.25, 3800, 3800, true);
    car.go(true, false, 0.25, 0.25, steps / 2, steps / 2, true);
    car.go(true, true, 0.5, 0.25, steps, steps, true);
    car.go(true, true, 0.25, 0.25);
};

// 左轮不动
Car.prototype.turnLeft90Sync = function() {
    log('turn left 90');
    this.stop();
    var steps = STEPS_FOR_90_DEG_SPEED_0_1;
    this.go(true, true, 0, 1, steps, steps, true);
    // 再往前走一点
    this.go(true, true, 0.5, 0.5, steps / 4, steps / 4, true);
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
