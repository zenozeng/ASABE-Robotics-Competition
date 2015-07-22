var vision = require('../build/Release/vision.node');

module.exports = {
    getTree: function() {
        var data = {};
        try {
            data = JSON.parse(vision.getVision());
        } finally {
            return data;
        }
    }
};
