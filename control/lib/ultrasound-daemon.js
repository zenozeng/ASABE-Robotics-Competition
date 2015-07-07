require('yapcduino')({global: true});

var pinEcho = process.args[1];
var pinTrigger = process.args[2];

// The distance between car and tree is less than 50cm
// So very small time is enough

var timeout = 100 * 1000; // 100ms (in us)

while (true) {
    // output a pulse
    digitalWrite(pinTrigger, LOW);
    delayMicroseconds(10);
    digitalWrite(pinTrigger, HIGH);
    delayMicroseconds(20);
    digitalWrite(pinTrigger, LOW);

    var duration = pulseIn(pinEcho, HIGH, timeout);
    var cm = duration / 29 / 2;
    var meters = cm / 100;
    var msg = {distance: meters};
    process.send(msg);
}
