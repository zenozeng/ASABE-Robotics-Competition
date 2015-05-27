require('yapcduino')({global: true});

var pinEcho = 1;
var pinTrigger = 0;

pinMode(pinTrigger, OUTPUT);
pinMode(pinEcho, INPUT);

function findDistance(pinEcho, pinTrigger)
{
    var duration, cm;

    // output a pulse
    digitalWrite(pinTrigger, LOW);
    delayMicroseconds(10);
    digitalWrite(pinTrigger, HIGH);
    delayMicroseconds(20);
    digitalWrite(pinTrigger, LOW);

    duration = pulseIn(pinEcho, HIGH, 10 * 1000 * 1000);
    cm= duration / 29 / 2;

    console.log("Distance (cm): ", cm);
    delay(3 * 1000);
}

for (;;)
    findDistance(pinEcho, pinTrigger);
