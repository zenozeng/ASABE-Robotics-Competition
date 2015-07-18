$(function() {
    window.recordMode = false;
    var interval;
    var count = 0;
    $('#record-mode').click(function() {
        window.recordMode = !window.recordMode;
        $('#record-mode').toggleClass('open');
        if (window.recordMode) {
            interval = setInterval(function() {
                count++;
                var $a = $('<a></a>').attr('href', "frame.jpg?_=" + Date.now());
                $a.attr('download', count);
                $('body').append($a);
                $a[0].click();
                $a.remove();
            }, 500);
        } else {
            clearInterval(interval);
        }
    });
});
