require('yapcduino')({global: true});
var pins = require('./pins');

var sensors = [1, 2, 3, 4].map(function(i) {
    return pins["BLACK_AND_WHITE_SENSOR_" + i];
});

// init pinMode
sensors.forEach(function(pin) {
    pinMode(pin, INPUT);
});

var read = function() {
    // result (from left to right) (eg, black, black, white, white: [0, 0, 1, 1])
    return sensors.map(function(pin) {
        return digitalRead(pin);
    });
};

var weights = [-5, -1, 1, 5];

// 返回一个数字，如果为正数，表明右边是白色的，则应该向左
// 如果为负数，则应该向右
// 如果为 0，表明方向很正
var getDirection = function() {
    var data = read();
    var sum = 0;
    data.forEach(function(v, i) {
        sum += weights[i] * v;
    });
    return sum;
};

// 返回一个数字，若黑线在车的右边则为正，否则为负
var getBlackLineDirection = function() {
    return getDirection() * -1;
};

var isOnVerticalLine = function() {
    return read().every(function(v) {
        return v === 0;
    });
};

module.exports = {
    getDirection: getDirection,
    isOnVerticalLine: isOnVerticalLine
};
