require('yapcduino')({global: true});

function Ultrasound(options) {
    this.pinEcho = options.pinEcho;
    this.pinTrigger = options.pinTrigger;

    pinMode(pinTrigger, OUTPUT);
    pinMode(pinEcho, INPUT);

    while (true) {
        // todo: suicide if parent dead
    }
}

Ultrasound.prototype.updateDistance = function() {
    // output a pulse
    digitalWrite(pinTrigger, LOW);
    delayMicroseconds(10);
    digitalWrite(pinTrigger, HIGH);
    delayMicroseconds(20);
    digitalWrite(pinTrigger, LOW);

    var duration = pulseIn(pinEcho, HIGH, 10 * 1000 * 1000);
    var cm = duration / 29 / 2;

    this.distance = distance;
    this.time = new Date();
};

Ultrasound.prototype.log = function() {
    var u = this;
    console.log({distance: u.distance, time: u.time});
};

function findDistance(pinEcho, pinTrigger)
{
    var duration, cm;



    console.log("Distance (cm): ", cm);
    delay(3 * 1000);
}

for (;;)
    findDistance(pinEcho, pinTrigger);
