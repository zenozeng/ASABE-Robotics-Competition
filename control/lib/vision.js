var fs = require('fs');

var vision = {
    getTree: function() {
        if (fs.existsSync('/run/shm/vision.json')) {
            var v = {};
            try {
                v = JSON.parse(fs.readFileSync('/run/shm/vision.json'));
            } catch (e) {}
            return v;
        }
        return {};
    }
};

module.exports = vision;
