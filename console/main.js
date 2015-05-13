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
        log.message = '<i class="fa fa-tree ' + log.tree.height+ ' ' + log.tree.color + '"></i>';
        log.message += 'Tree detected: ' + JSON.stringify(log.tree);
    }
    $('#logs').prepend('<p class="message">' + log.message + '</p>');
    $('#logs').prepend('<p class="timestamp">' + d.toString() + '</p>');
};

/**
 * Draw a log
 *
 */
var treeCount = 0;
var drawLog = function(log) {
    if (log.tree) {
        treeCount++;
    }
    var progress = parseInt(treeCount / 25 * 100) + '%';
    $('#progress').html('<h2>Current Progress</h2>' + treeCount + ' / 25 = ' + progress);
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
            setTimeout(process, 500);
        }
    };
    process();
});
