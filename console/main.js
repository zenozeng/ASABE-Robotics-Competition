/**
 * Fetch Log
 * @returns {Promise} Logs (JSON Object)
 */
var fetchLogs = function() {
    return new Promise(function(resolve, reject) {
        $.get('log.json', function(data) {
            resolve(data);
        });
    });
};

var bootTime = Date.now(); // fake boot time

/**
 * Write a log to current page
 *
 */
var writeLog = function(log) {
    var d = new Date(bootTime + log.timestamp);
    if (log.tree) {
        if (log.tree.empty) {
            log.message = '<i class="fa fa-circle-thin"></i>';
        } else {
            log.message = '<i class="fa fa-tree ' + log.tree.height+ ' ' + log.tree.color + '"></i>';
        }
        log.message += 'Tree detected: ' + JSON.stringify(log.tree);
    }
    $('#logs').prepend('<p class="message">' + log.message + '</p>');
    $('#logs').prepend('<p class="timestamp">' + d.toString() + '</p>');
};

/**
 * Draw a log
 *
 */
var types = [];
var treeCount = 0;
var drawLog = function(log) {
    if (!log.tree) {
        return;
    }

    // update tree count
    treeCount++;
    var progress = parseInt(treeCount / 25 * 100) + '%';
    $('#progress').html('<h2>Current Progress</h2>' + treeCount + ' / 25 = ' + progress);

    // update canvas
    var left = 74;
    var top = 280;
    left += (log.tree.x - 1) * 39;
    top -= (log.tree.y - 1) * 68;
    var size = log.tree.height === "high" ? 36 : 18;
    left -= size / 2;
    top -= size / 2;
    $('#canvas').append('<i class="fa fa-tree ' + log.tree.height+ ' ' + log.tree.color + '" style="top:' + top + 'px; left: ' + left + 'px"></i>');

    // update collected types
    var typeid = log.tree.height + log.tree.color;
    if (types.indexOf(typeid) < 0) {
        types.push(typeid);
        $('#collected').append('<i class="fa fa-tree ' + log.tree.height+ ' ' + log.tree.color + '"></i>');
    }
};

/**
 * Main Logic
 */
fetchLogs().then(function(logs) {
    var process = function() {
        var log = logs.shift();
        writeLog(log);
        drawLog(log);
        if (logs.length > 0) {
            setTimeout(process, 1000);
        }
    };
    process();
});
