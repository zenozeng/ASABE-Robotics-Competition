var pcduino = require('yapcduino');

var PWM_PERIOD = 20 * 1000;

var PIN_CLK = 0;
var PIN_CW = 2; // 指定方向
var PIN_EN = 3; // 决定是否在工作状态

function forward(pin) {
    pcduino.digitalPulse(pin, pulse, PWM_PERIOD, loops);
}
