// by 奶叔 and Zeno Zeng

var servo = require('./lib/servo.js');
var car = require('./lib/car.js');
var pcduino = require('yapcduino');

servo.setAngle(1,0);
pcduino.usleep(1 * 1000 * 1000);
servo.setAngle(1,180);
pcduino.usleep(1 * 1000 * 1000);
servo.setAngle(1,90);

car.forward();
pcduino.usleep(3 * 1000 * 1000);
car.backward();
pcduino.usleep(3 * 1000 * 1000);
car.turnLeft();
pcduino.usleep(3 * 1000 * 1000);
car.turnRight();
pcduino.usleep(3 * 1000 * 1000);
car.stop();
pcduino.usleep(3 * 1000 * 1000);

servo.setAngle(1, 0);
pcduino.usleep(1 * 1000 * 1000);
servo.setAngle(0, 45);
pcduino.usleep(1 * 1000 * 1000);
servo.setAngle(2, 15);
pcduino.usleep(1 * 1000 * 1000);
servo.setAngle(2, 0);
pcduino.usleep(1 * 1000 * 1000);
servo.setAngle(0, 0);
