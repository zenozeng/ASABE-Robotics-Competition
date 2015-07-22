$(function() {
    ["start", "pause", "resume", "debug", "stop", "go", "unit-test"].forEach(function(cmd) {
        $("#ctrl-" + cmd).click(function() {
            $.post("/control/" + cmd);
        });
    });
});
