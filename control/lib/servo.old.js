var pcduino = require('pcduino');
var digital = pcduino.digital;

// 控制机械臂的舵机
// var pin = 0;
// digital.digitalWrite(pin, digital.HIGH);


// * pin(3/9/10/11) support frequency[125-2000]Hz @different dutycycle
// * pin(5/6) support frequency[195,260,390,520,781] @256 dutycycle

// time in us (0-1000)
var sleep = function(time) {
    var start = (process.hrtime()[1] / 1000) | 0; // in us
    var now;
    while (true) {
        now = (process.hrtime()[1] / 1000) | 0; // in us
        if (now < start) {
            now += 1000000;
        }
        if ((now - start) > time) {
            break;
        }
    }
};

var PWM_PERIOD = 20 * 1000; // 20ms
var setPulse = function(pin, pulse) {
    digital.digitalWrite(pin, digital.HIGH);
    sleep(pulse);
    digital.digitalWrite(pin, digital.LOW);
    sleep(PWM_PERIOD - pulse);
};

var setServoAngle = function(pin, angle) {
    digital.pinMode(pin, digital.OUTPUT);
    if (angle >= 0 && angle <= 180) {
        // translate angle to a pulse width value between 500-2480
        setPulse(pin, angle * (2000 / 180) + 500);
    }
};

var l = 10;
while (true) {
    setServoAngle(0, 0);
    l--;
}
