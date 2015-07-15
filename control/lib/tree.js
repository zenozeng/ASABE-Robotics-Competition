var vision = require('./lib/vision');
var ir = require('./lib/ir');

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
            hue: vision.hue,
            time: vision.time,
            position: vision.position,
            height: isHighTree()
        };
    }
};
