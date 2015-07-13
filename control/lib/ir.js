// Module for IR GP2Y0A21YK0F
require('yapcduino')({global: true});
var pins = require('./pins');

var adc = pins.IR;

adc = 4;

var getDistance = function() {
    var val = analogRead(adc);
    var v = val * 3.3 / 4096;
    return v;
};

setInterval(function() {
    var d = getDistance();
    console.log(d);
}, 20);
