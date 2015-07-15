var express = require('express');
var serveStatic = require('serve-static');

var app = express();

app.use(serveStatic('../console', {'index': ['index.html', 'index.htm']}));
app.listen(80);
