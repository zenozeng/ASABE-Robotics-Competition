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

// 前左，前右；后左，后右。
var weights = [-1, 1, 1, -1];

var equal = function(obj1, obj2) {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
};

// 返回一个数字，若黑线在车的右边则为正，否则为负
var getBlackLineDirection = function() {
    var data = read();

    if (equal(data, [1, 0, 1, 0])) {
        return 2; // 车前后都在线的左边
    }

    if (equal(data, [0, 1, 0, 1])) {
        return -2; // 车前后都在线的右边
    }

    var sum = 0;
    data.forEach(function(v, i) {
        sum += weights[i] * v;
    });
    return sum * -1;
};

var isOnVerticalLine = function() {
    return read().every(function(v) {
        return v === 0;
    });
};

module.exports = {
    read: read,
    getBlackLineDirection: getBlackLineDirection,
    isOnVerticalLine: isOnVerticalLine
};
