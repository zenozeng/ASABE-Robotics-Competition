var express = require('express');
var serveStatic = require('serve-static');
var cp = require('child_process');

var car = null;
var status = {};

var app = express();

app.post('/control/start', function (req, res) {
    car = cp.fork(__dirname + '/index.js');
    car.on('message', function(msg) {
        Object.keys(msg).forEach(function(k) {
            status[k] = msg[k];
        });
    });
    res.send('I am happy.');
});

app.post('/control/pause', function(req, res) {
    if (car) {
        car.send({command: 'pause'});
    }
    res.send('I am happy.');
});

app.post('/control/resume', function(req, res) {
    if (car) {
        car.send({command: 'resume'});
    }
    res.send('I am happy.');
});

app.post('/control/stop', function(req, res) {
    car.kill('SIGTERM');
    car = null;
    res.send('I am happy.');
});

app.get('/status', function(req, res) {
    res.send(JSON.stringify(status));
});

app.use(serveStatic('../console', {'index': ['index.html', 'index.htm']}));

app.listen(80);
