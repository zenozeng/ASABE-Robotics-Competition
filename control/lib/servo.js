var pcduino = require('yapcduino');

function setAngle(pin, angle) {
    pcduino.pinMode(pin, pcduino.OUTPUT);
    var pwm = new pcduino.SoftPWM(pin);

    var PWM_PERIOD = 20 * 1000;
    if (angle >= 0 && angle <= 180) {
        // translate angle to a pulse width value between 500-2480
        var pulse = angle * (2000 / 180) + 500;
        var dutyCycle = pulse / PWM_PERIOD;
    } else {
        throw new Error('Invalid angle. angle should be >=0 && <=180');
    }

    pwm.write(dutyCycle);
}

module.exports = {
    setAngle: setAngle
};
