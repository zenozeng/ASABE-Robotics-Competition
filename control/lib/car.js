var pins = require('./pins');
var pcduino = require('yapcduino');

var left = {clk: pins.LEFT_STEPPING_MOTOR_CLK, cw: pins.LEFT_STEPPING_MOTOR_CW};
var right = {clk: pins.RIGHT_STEPPING_MOTOR_CLK, cw: pins.RIGHT_STEPPING_MOTOR_CW};

[left.clk, left.cw, right.clk, right.cw].forEach(function(pin) {
    pcduino.pinMode(pin, pcduino.OUTPUT);
});

function stop() {
    pcduino.digitalWritePWM(left.clk, 0);
    pcduino.digitalWritePWM(right.clk, 0);
}

function forward() {
    pcduino.digitalWrite(left.cw, pcduino.HIGH); // 左轮逆时针
    pcduino.digitalWrite(right.cw, pcduino.LOW); // 右轮顺时针
    pcduino.digitalWritePWM(left.clk, 0.5);
    pcduino.digitalWritePWM(right.clk, 0.5);
}

function backward() {
    pcduino.digitalWrite(left.cw, pcduino.LOW); // 左轮顺时针
    pcduino.digitalWrite(right.cw, pcduino.HIGH); // 右轮逆时针
    pcduino.digitalWritePWM(left.clk, 0.5);
    pcduino.digitalWritePWM(right.clk, 0.5);
}

function turnLeft() {
    pcduino.digitalWrite(left.cw, pcduino.HIGH);
    pcduino.digitalWrite(right.cw, pcduino.LOW);
    pcduino.digitalWritePWM(left.clk, 0);
    pcduino.digitalWritePWM(right.clk, 0.5);
}

function turnRight() {
    pcduino.digitalWrite(left.cw, pcduino.HIGH);
    pcduino.digitalWrite(right.cw, pcduino.LOW);
    pcduino.digitalWritePWM(left.clk, 0.5);
    pcduino.digitalWritePWM(right.clk, 0);
}

module.exports = {
    stop: stop,
    forward: forward,
    backward: backward,
    turnLeft: turnLeft,
    turnRight: turnRight
};
