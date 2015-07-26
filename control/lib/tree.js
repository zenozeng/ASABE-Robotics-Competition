var vision = require('./vision');
var pins = require('./pins');
var head = require('./head');

[pins.IR_TREE, pins.IR_HIGH_TREE, pins.IR_TREE_FINAL_STOP].forEach(function(pin) {
    pinMode(pin, INPUT);
});

var heightInfo = [];

var collectHeightInfo = function() {
    heightInfo.push(digitalRead(pins.IR_HIGH_TREE));
};

var resetHeightInfo = function() {
    heightInfo = [];
};

var getTree = function() {
    var isHigh = heightInfo.indexOf(0) > -1;
    var v = vision.getTree();
    return {
        exists: digitalRead(pins.IR_TREE) == 0,
        color: v.color,
        stddev: v.stddev,
        hue: v.hue,
        saturation: v.saturation,
        time: v.time,
        position: v.position,
        isHigh: isHigh,
        height: isHigh ? "high" : "low"
    };
};

var exists = function() {
    var tree = getTree();
    var exists = tree.exists;
    // exists = exists && (tree.position > 0.45 && tree.position < 0.6);
    // exists = exists && (tree.position > 0.5 && tree.position < 0.6);
    return exists;
};

var shouldStop = function() {
    return digitalRead(pins.IR_TREE_FINAL_STOP) == 0;
};

module.exports = {
    shouldStop: shouldStop,
    exists: exists,
    getTree: getTree,
    collectHeightInfo: collectHeightInfo,
    resetHeightInfo: resetHeightInfo
};
