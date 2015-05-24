var pcduino = require('yapcduino');

var pinEcho = 3;
var pinTrigger = 0;

var HIGH = pcduino.HIGH;
var LOW = pcduino.LOW;

function findDistance(pinEcho, pinTrigger)
{
    var duration, cm;

    // output a pulse
    pcduino.pinMode(pinTrigger, pcduino.OUTPUT);
    pcduino.digitalWrite(pinTrigger, HIGH);
    pcduino.delayMicroseconds(20);
    pcduino.digitalWrite(pinTrigger, LOW);

    duration = pcduino.pulseIn(pinEcho, HIGH, 10000000);
    cm= duration / 29 / 2;

    console.log("Distance (cm): ", cm);

    pcduino.delay(1000);
}

findDistance(pinEcho, pinTrigger);
