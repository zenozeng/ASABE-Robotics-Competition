require('yapcduino')({global: true});
var pins = require('./pins');
var whiteSensors = require('./white-sensors');

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

Car.prototype.go = function(leftCW, rightCW, leftSpeed, rightSpeed) {
    // 设置方向
    digitalWrite(left.cw, leftCW);
    digitalWrite(right.cw, rightCW);
    log(JSON.stringify({
        go: {
            left: {cw: leftCW, speed: leftSpeed},
            right: {cw: rightCW, speed: rightSpeed}
        }
    }));

    // 设置速度
    var period = 10000;
    var motors = [leftMotor, rightMotor];
    [leftSpeed, rightSpeed].forEach(function(speed, index) {
        console.log(index, speed, motors[index]);
        if (speed === 0) {
            motors[index].write(0);
        } else {
            motors[index].write(0.5, {period: parseInt(period / leftSpeed)});
        }
    });
};

Car.prototype.forward = function() {
    // 左轮逆时针，右轮顺时针
    log('forward');
    this.go(HIGH, LOW, 1, 1);
};

Car.prototype.backward = function() {
    // 左轮顺时针，右轮逆时针
    log('backward');
    this.go(LOW, HIGH, 1, 1);
};

Car.prototype.turnLeft = function() {
    log('turn left');
    this.go(HIGH, LOW, 0, 1);
};

Car.prototype.turnRight = function() {
    log('turn right');
    this.go(HIGH, LOW, 1, 0);
};

Car.prototype.autoForward = function() {
    var car = this;
    car.autoForwardInterval = setInterval(function() {
        var leftIsBlack = whiteSensors.left.isBlack();
        // var middleIsBlack = whiteSensors.middle.isBlack();
        var rightIsBlack = whiteSensors.right.isBlack();

        if (DEBUG) {
            console.log([leftIsBlack, rightIsBlack]);
        }

        if (leftIsBlack) {
            car.turnLeft();
            return;
        }
        if (rightIsBlack) {
            car.turnRight();
            return;
        }
        car.forward();

    }, 100);
};

Car.prototype.stopAutoForward = function() {
    if (typeof this.autoForwardInterval !== "undefined") {
        clearInterval(this.autoForwardInterval);
    }
};

Car.prototype.bigTurn = function() {
};

var car = new Car();

module.exports = car;
