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

var stepsScale = 0.25;

// offset 为正则是向外
Manipulator.prototype.move = function(offsetSteps) {
    this.position += offsetSteps;
    digitalWrite(cw, offsetSteps > 0 ? LOW : HIGH);
    motor.write(0.5, {
        period: 10000 * stepsScale,
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
};

Manipulator.prototype.unset = function() {
};


var manipulator = new Manipulator();

module.exports = manipulator;
