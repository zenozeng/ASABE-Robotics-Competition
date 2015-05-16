var pins = require('./pins');
var pcduino = require('yapcduino');
var whiteSensors = require('./white-sensors');

var left = {clk: pins.LEFT_STEPPING_MOTOR_CLK, cw: pins.LEFT_STEPPING_MOTOR_CW};
var right = {clk: pins.RIGHT_STEPPING_MOTOR_CLK, cw: pins.RIGHT_STEPPING_MOTOR_CW};

[left.clk, left.cw, right.clk, right.cw].forEach(function(pin) {
    pcduino.pinMode(pin, pcduino.OUTPUT);
});

var period = 20000; // 或者 5000

var DEBUG = true;

function stop() {
    pcduino.digitalWritePWM(left.clk, 0);
    pcduino.digitalWritePWM(right.clk, 0);
}

function forward() {
    pcduino.digitalWrite(left.cw, pcduino.HIGH, period); // 左轮逆时针
    pcduino.digitalWrite(right.cw, pcduino.LOW, period); // 右轮顺时针
    pcduino.digitalWritePWM(left.clk, 0.5, period);
    pcduino.digitalWritePWM(right.clk, 0.5, period);
}

function backward() {
    pcduino.digitalWrite(left.cw, pcduino.LOW, period); // 左轮顺时针
    pcduino.digitalWrite(right.cw, pcduino.HIGH, period); // 右轮逆时针
    pcduino.digitalWritePWM(left.clk, 0.5, period);
    pcduino.digitalWritePWM(right.clk, 0.5, period);
}

function turnLeft() {
    pcduino.digitalWrite(left.cw, pcduino.HIGH, period);
    pcduino.digitalWrite(right.cw, pcduino.LOW, period);
    pcduino.digitalWritePWM(left.clk, 0, period);
    pcduino.digitalWritePWM(right.clk, 0.5, period);
}

function turnRight() {
    pcduino.digitalWrite(left.cw, pcduino.HIGH, period);
    pcduino.digitalWrite(right.cw, pcduino.LOW, period);
    pcduino.digitalWritePWM(left.clk, 0.5, period);
    pcduino.digitalWritePWM(right.clk, 0, period);
}

function auto() {
    setInterval(function() {
        var leftIsBlack = whiteSensors.left.isBlack();
        var middleIsBlack = whiteSensors.middle.isBlack();
        var rightIsBlack = whiteSensors.right.isBlack();
        if (DEBUG) {
            console.log([leftIsBlack, middleIsBlack, rightIsBlack]);
        }
        if (leftIsBlack && rightIsBlack) {
            // 转弯吧
            return;
        }
        if (leftIsBlack) {
            turnLeft();
            console.log('turn left');
            return;
        }
        if (rightIsBlack) {
            turnRight();
            console.log('turn right');
            return;
        }
        console.log('forward');
        forward();
    }, 1000);
}

module.exports = {
    auto: auto,
    stop: stop,
    forward: forward,
    backward: backward,
    turnLeft: turnLeft,
    turnRight: turnRight
};
