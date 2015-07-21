var vision = require('./vision');
var pins = require('./pins');
var head = require('./head');

var getTree = function() {
    var isHigh = digitalRead(pins.IR_HIGH_TREE) == 0;
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

var shouldStop = function() {
    var tree = getTree();
    var exists = tree.exists;
    // exists = exists && (tree.position > 0.4 && tree.position < 0.6);
    // exists = exists && head.isOnBlackLine();
    return exists;
};

module.exports = {
    shouldStop: shouldStop,
    getTree: getTree
};
