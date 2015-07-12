require('yapcudino')({global: true});
var pins = require('./pins');

var sensors = [1, 2, 3, 4].map(function(i) {
    return pins["BLACK_AND_WHITE_SENSOR_" + i];
});

// init pinMode
sensors.forEach(function(pin) {
    pinMode(pin, INPUT);
});

var getDirection = function() {
    return sensors.map(function(pin) {
        return digitalRead(pin) === 0;
    });
};
