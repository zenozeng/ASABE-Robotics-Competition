var express = require('express');
var serveStatic = require('serve-static');
var cp = require('child_process');
var fs = require('fs');

var car = null;
var status = {};

var app = express();

app.post('/control/start', function (req, res) {
    console.log('server.js: start');
    if (car) {
        return;
    }
    car = cp.fork(__dirname + '/index.js');
    car.on('message', function(msg) {
        Object.keys(msg).forEach(function(k) {
            status[k] = msg[k];
        });
    });
    res.send('I am happy.');
});

app.post('/control/pause', function(req, res) {
    console.log('server.js: pause');
    if (car) {
        car.send({command: 'pause'});
    }
    res.send('I am happy.');
});

app.post('/control/resume', function(req, res) {
    console.log('server.js: resume');
    if (car) {
        car.send({command: 'resume'});
    }
    res.send('I am happy.');
});

app.post('/control/stop', function(req, res) {
    console.log('server.js: stop');
    if (car) {
        car.kill('SIGHUP');
    }
    car = null;
    res.send('I am happy.');
});

app.get('/status', function(req, res) {
    res.send(JSON.stringify(status));
});

app.get('/frame.jpg', function(req, res) {
    console.log('fetch /run/shm/frame.jpg');
    res.writeHead(200, { 'content-type': 'image/jpeg' });
    try {
        fs.createReadStream('/run/shm/frame.jpg').pipe(res);
    } catch (e) {
        res.writeHead(404, { 'content-type': 'image/jpeg' });
        res.end();
    }
});

app.use(serveStatic('../console', {'index': ['index.html', 'index.htm']}));

app.listen(80);
