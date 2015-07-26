var vision = require('./lib/vision');

setInterval(function() {
    console.log(vision.getTree());
}, 20);
