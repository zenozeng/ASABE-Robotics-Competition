var pcduino = require('yapcduino');

var setServoAngle = function(pin, angle) {
    pcduino.pinMode(pin, pcduino.OUTPUT);
    var PWM_PERIOD = 20 * 1000;
    if (angle >= 0 && angle <= 180) {
        // translate angle to a pulse width value between 500-2480
        var pulse = angle * (2000 / 180) + 500;
    } else {
        throw new Error('Invalid angle. angle should be >=0 && <=180');
    }
    var loops = 10; // 保持脉冲让机械臂有时间运动过去
    pcduino.setPulse(pin, pulse, PWM_PERIOD, loops);
};
