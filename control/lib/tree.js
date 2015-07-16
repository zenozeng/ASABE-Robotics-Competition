var vision = require('./vision');
var ir = require('./ir');

var isHighTree = function() {
    var v = ir.getVolt();
    return v > 1; // todo: fix this
};

module.exports = {
    isTree: function() {
        return vision.isTree();
    },
    getTree: function() {
        return {
            exists: vision.exists,
            color: vision.color,
            stddev: vision.stddev,
            hue: vision.hue,
            time: vision.time,
            position: vision.position,
            height: isHighTree()
        };
    }
};
