$(function() {
    ["start", "pause", "resume", "stop", "go"].forEach(function(cmd) {
        $("#ctrl-" + cmd).click(function() {
            $.post("/control/" + cmd);
        });
    });
});
