require('yapcduino')({global: true});

var pinEcho = process.argv[2];
var pinTrigger = process.argv[3];

// The distance between car and tree is less than 50cm
// So very small time is enough

var timeout = 100 * 1000; // 100ms (in us)

pinMode(pinTrigger, OUTPUT);
pinMode(pinEcho, INPUT);

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
    var msg = {distance: meters, duration: duration};

    process.send(msg);
    delayMicroseconds(timeout * 1.1); // avoid mess
}
