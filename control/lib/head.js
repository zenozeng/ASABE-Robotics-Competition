require('yapcduino')({global: true});
var pins = require('./pins');

var sensors = [1, 2, 3, 4].map(function(i) {
    return pins["BLACK_AND_WHITE_SENSOR_" + i];
});

// init pinMode
sensors.forEach(function(pin) {
    pinMode(pin, INPUT);
});

pinMode(pins.BLACK_AND_WHITE_SENSOR_5, INPUT);
pinMode(pins.BLACK_AND_WHITE_SENSOR_6, INPUT);

var read = function() {
    // result (from left to right) (eg, black, black, white, white: [0, 0, 1, 1])
    return sensors.map(function(pin) {
        return digitalRead(pin);
    });
};

var readOuter = function() {
    return [5, 6].map(function(i) {
        return pins["BLACK_AND_WHITE_SENSOR_" + i];
    }).map(function(pin) {
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
    var outer = readOuter();
    // console.log({inner: data, outer: outer});

    if (equal(data, [0, 0, 0, 0])) {
        return 0;
    }

    if (equal(data, [1, 0, 0, 0])) {
        return 1;
    }

    if (equal(data, [0, 1, 0, 0])) {
        return -1;
    }

    if (equal(data, [0, 0, 1, 0])) {
        return -1;
    }

    if (equal(data, [0, 0, 0, 1])) {
        return 1;
    }

    if (equal(data, [1, 1, 0, 0])) {
        return 0;
    }

    if (equal(data, [1, 0, 1, 0])) {
        return 2;
    }

    if (equal(data, [1, 0, 0, 1])) {
        return 2;
    }

    if (equal(data, [0, 1, 1, 0])) {
        return -2;
    }

    if (equal(data, [0, 1, 0, 1])) {
        return -2;
    }

    if (equal(data, [0, 0, 1, 1])) {
        return 0;
    }

    if (equal(data, [1, 1, 1, 0])) {
        if (equal(outer, [1, 0])) {
            return 3;
        } else if (equal(outer, [0, 1])) {
            return -3;
        } else {
            return 0;
        }
    }

    if (equal(data, [1, 1, 0, 1])) {
        if (equal(outer, [1, 0])) {
            return 3;
        } else if (equal(outer, [0, 1])) {
            return -3;
        } else {
            return 0;
        }
    }

    if (equal(data, [1, 0, 1, 1])) {
        return 1;
    }

    if (equal(data, [0, 1, 1, 1])) {
        return -1;
    }

    if (equal(data, [1, 1, 1, 1])) {
        if (equal(outer, [1, 0])) {
            return 3;
        } else if (equal(outer, [0, 1])) {
            return -3;
        } else {
            return 0;
        }
    }

    return 0;

};

var getSum = function(arr) {
    var sum = 0;
    arr.forEach(function(id) {
        sum += digitalRead(pins["BLACK_AND_WHITE_SENSOR_"+id]);
    });
    return sum;
};

var getAll = function() {
    return [1, 2, 3, 4, 5].map(function(id) {
        return digitalRead(pins["BLACK_AND_WHITE_SENSOR_"+id]);
    });
};

// 是否走在黑横线上
var isCrossing = function() {
    var front = [1, 2, 5, 6];
    var back = [3, 4];
    // 前面至少三个灭，后面至少一个灭
    var isCrossing = (getSum(front) <= 1) && (getSum(back) < 2);
    //console.log({isCrossing: isCrossing});
    return isCrossing;
};

module.exports = {
    read: read,
    getBlackLineDirection: getBlackLineDirection,
    getAll: getAll,
    isCrossing: isCrossing,
    // 如果前后各有至少一灯在黑线上，那么我们认为我们在沿着黑线上走
    isOnBlackLine: function() {
        var front = [1, 2];
        var back = [3, 4];
        // 前面至少1个灭，后面至少1个灭
        return (getSum(front) < 2) && (getSum(back) < 2) && (!isCrossing());
    }
};
