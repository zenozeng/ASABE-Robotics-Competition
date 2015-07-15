$(function() {
    ["start", "pause", "resume", "stop"].forEach(function(cmd) {
        $("#ctrl-" + cmd).click(function() {
            $.post("/control/" + cmd);
        });
    });
});
