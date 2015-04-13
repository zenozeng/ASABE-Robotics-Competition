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

/**
 * Draw a log
 *
 */
var drawLog = function(log) {
};

/**
 * Draw Logs (with UUID based diff)
 * @param {Array} logs - Logs (JSON Object)
 */
var drawnLogs = [];
var drawLogs = function(logs) {

    // Sort logs by time-stamp (older first)
    logs.sort(function(a, b) {
        return a.timestamp - b.timestamp;
    });

    logs.filter(function(log) {
        // ignore drawn logs
        return !drawnLogs.indexOf(log.uuid);
    }).forEach(function(log) {
        drawLog(log);
        drawnLogs.push(log.uuid);
    });
};

/**
 * Main Logic
 */
fetchLogs.then(drawLogs);
