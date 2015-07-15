$(function() {
    ["start", "pause", "resume", "pause"].forEach(function(cmd) {
        $("#ctrl-" + cmd).click(function() {
            $.post("/control/" + cmd);
        });
    });
});
