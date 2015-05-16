var pins = require('./pins');
var pcduino = require('yapcduino');

var left = {clk: pins.LEFT_STEPPING_MOTOR_CLK, cw: pins.LEFT_STEPPING_MOTOR_CW};
var right = {clk: pins.RIGHT_STEPPING_MOTOR_CLK, cw: pins.RIGHT_STEPPING_MOTOR_CW};

function stop() {
    pcduino.digitalWritePWM(left.clk, 0);
    pcduino.digitalWritePWM(right.clk, 0);
}

function forward() {
    pcduino.digitalWrite(left.cw, pcduino.LOW);
    pcduino.digitalWrite(right.cw, pcduino.LOW);
    pcduino.digitalWritePWM(left.clk, 0.5);
    pcduino.digitalWritePWM(right.clk, 0.5);
}

function backward() {
    pcduino.digitalWrite(left.cw, pcduino.HIGH);
    pcduino.digitalWrite(right.cw, pcduino.HIGH);
    pcduino.digitalWritePWM(left.clk, 0.5);
    pcduino.digitalWritePWM(right.clk, 0.5);
}

function turnLeft() {
    pcduino.digitalWrite(left.cw, pcduino.LOW);
    pcduino.digitalWrite(right.cw, pcduino.LOW);
    pcduino.digitalWritePWM(left.clk, 0);
    pcduino.digitalWritePWM(right.clk, 0.5);
}

function turnRight() {
    pcduino.digitalWrite(left.cw, pcduino.LOW);
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
