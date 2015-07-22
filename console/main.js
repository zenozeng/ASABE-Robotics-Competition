/**
 * Write a log to current page
 *
 */
var writeLog = function(log) {
    if (log.tree) {
        // if (log.tree.empty) {
        //     log.message = '<i class="fa fa-circle-thin"></i>' + 'Empty ';
        // } else {
        log.message = '<i class="fa fa-tree ' + log.tree.height+ ' ' + log.tree.color + '"></i>';
        log.message += 'Tree detected: ' + JSON.stringify(log.tree);
    }
    $('#logs').prepend('<p class="message">' + log.message + '</p>');
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

    if (log.tree.row < 1) {
        return; // it's for debug
    }

    // update tree count
    treeCount++;
    var progress = parseInt(treeCount / 25 * 100) + '%';
    $('#progress').html('<h2>Current Progress</h2>' + treeCount + ' / 25 = ' + progress);

    // update canvas
    var left = 74;
    var top = 280;
    left += (log.tree.col - 1) * 39;
    top -= (log.tree.row - 1) * 67;
    var size = log.tree.height === "high" ? 36 : 18;
    left -= size / 2;
    top -= size / 2;
    if (log.tree.empty) {
        left -= 7;
        top -= 7;
        $('#canvas').append('<i class="fa fa-circle-thin" style="top:' + top + 'px; left: ' + left + 'px"></i>');
    } else {
        $('#canvas').append('<i class="fa fa-tree ' + log.tree.height+ ' ' + log.tree.color + '" style="top:' + top + 'px; left: ' + left + 'px"></i>');
    }

    // update collected types
    if (log.tree.empty) {
        return;
    }
    var typeid = log.tree.height + log.tree.color;
    if (types.indexOf(typeid) < 0) {
        types.push(typeid);
        $('#collected').append('<i class="fa fa-tree ' + log.tree.height+ ' ' + log.tree.color + '"></i>');
    }
};

/**
 * Main Logic
 */
(function() {
    var lastLogsLength = null;

    setInterval(function() {
        var url = '/logs';
        // url = 'logs2.json';

        $.get(url + '?_=' + Date.now(), function(logs) {
            // only update if necessary

            if (logs && (logs.length === lastLogsLength)) {
                return;
            }
            lastLogsLength = logs.length;

            try {
                if (typeof logs == "string") {
                    logs = JSON.parse(logs);
                    logs = logs.logs;
                }
                treeCount = 0; // reset count
                $('#canvas i').remove();
                $('#logs').html('');
                logs.forEach(function(log) {
                    var newlog = {message: log.message};
                    if (log.tree) {
                        newlog.tree = {
                            col: log.tree.col,
                            row: log.tree.row,
                            height: log.tree.height,
                            color: log.tree.color
                        };
                    }
                    writeLog(newlog);
                    drawLog(log);
                });
            } finally {
            }
        });

    }, 100);
})();
