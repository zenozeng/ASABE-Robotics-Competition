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
    $('#logs').append('<p class="timestamp">' + d.toString() + '</p>');
    $('#logs').append('<p class="message">' + log.message + '</p>');
};

/**
 * Draw a log
 *
 */
var drawLog = function(log) {
};

/**
 * Main Logic
 */
fetchLogs().then(function(logs) {
    logs.forEach(writeLog);
    logs.forEach(drawLog);
});
