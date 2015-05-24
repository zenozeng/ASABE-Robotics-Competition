var pins = require('./pins');
var pcduino = require('yapcduino');
var whiteSensors = require('./white-sensors');

var left = {clk: pins.LEFT_STEPPING_MOTOR_CLK, cw: pins.LEFT_STEPPING_MOTOR_CW};
var right = {clk: pins.RIGHT_STEPPING_MOTOR_CLK, cw: pins.RIGHT_STEPPING_MOTOR_CW};

[left.clk, left.cw, right.clk, right.cw].forEach(function(pin) {
    pcduino.pinMode(pin, pcduino.OUTPUT);
});

var leftMotor = new pcduino.SoftPWM(left.clk);
var rightMotor = new pcduino.SoftPWM(right.clk);

var period = 10000; // 或者 5000

var DEBUG = true;

function stop() {
    leftMotor.write(0);
    rightMotor.write(0);
}

function forward() {
    pcduino.digitalWrite(left.cw, pcduino.HIGH); // 左轮逆时针
    pcduino.digitalWrite(right.cw, pcduino.LOW); // 右轮顺时针

    leftMotor.write(0.5, {period: period});
    rightMotor.write(0.5, {period: period});
}

function backward() {
    pcduino.digitalWrite(left.cw, pcduino.LOW); // 左轮顺时针
    pcduino.digitalWrite(right.cw, pcduino.HIGH); // 右轮逆时针

    leftMotor.write(0.5, {period: period});
    rightMotor.write(0.5, {period: period});
}

function turnLeft() {
    pcduino.digitalWrite(left.cw, pcduino.HIGH, period);
    pcduino.digitalWrite(right.cw, pcduino.LOW, period);

    leftMotor.write(0, {period: period});
    rightMotor.write(0.5, {period: period});
}

function turnRight() {
    pcduino.digitalWrite(left.cw, pcduino.HIGH, period);
    pcduino.digitalWrite(right.cw, pcduino.LOW, period);

    leftMotor.write(0.5, {period: period});
    rightMotor.write(0, {period: period});
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
