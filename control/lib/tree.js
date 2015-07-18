var vision = require('./vision');
var pins = require('./pins');
var head = require('./head');

var getTree = function() {
    return {
        exists: digitalRead(pins.IR_TREE) == 0,
        color: vision.color,
        stddev: vision.stddev,
        hue: vision.hue,
        saturation: vision.saturation,
        time: vision.time,
        position: vision.position,
        isHigh: digitalRead(pins.IR_HIGH_TREE) == 0
    };
};

var shouldStop = function() {
    var tree = getTree();
    var exists = tree.exists;
    exists = exists && (tree.position > 0.4 && tree.position < 0.6);
    // exists = exists && head.isOnBlackLine();
    return exists;
};

module.exports = {
    shouldStop: shouldStop,
    getTree: getTree
};
