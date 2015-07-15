// Module for IR GP2Y0A21YK0F
require('yapcduino')({global: true});
var pins = require('./pins');

var adc = pins.IR;

var getVolt = function() {
    var val = analogRead(adc);
    var v = val * 3.3 / 4096;
    return v;
};

module.exports = {
    getVolt: getVolt
};
