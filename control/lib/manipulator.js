require('yapcduino')({global: true});
var pins = require('./pins');

var clk = pins.MANIPULATOR_STEPPING_MOTOR_CLK;
var cw = pins.MANIPULATOR_STEPPING_MOTOR_CW;
var motor = new SoftPWM(clk);

pinMode(clk, OUTPUT);
pinMode(cw, OUTPUT);

function Manipulator() {
    this.position = 0;
}

var stepScale = 0.125;

// offset 为正则是向外
Manipulator.prototype.move = function(offsetSteps) {
    this.position += offsetSteps;
    digitalWrite(cw, offsetSteps > 0 ? LOW : HIGH);
    motor.write(0.5, {
        period: 1000 * stepScale,
        loops: Math.abs(offsetSteps)
    });
    motor.sync();
};

// usage: moveTo(0)
//        moveTo(100)
Manipulator.prototype.moveTo = function(position) {
    var offset = position - this.position;
    this.move(offset, 1);
};

Manipulator.prototype.set = function() {
    this.move(3700 * 6);
};

Manipulator.prototype.unset = function() {
    this.move(- 3700 * 6);
};


var manipulator = new Manipulator();

module.exports = manipulator;
