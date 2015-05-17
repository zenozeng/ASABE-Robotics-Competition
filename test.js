





//感谢曾大神和三nou森


var setAngle = require('./lib/servo.js');
var car = require('./lib/car.js');
servo.setAngle(1,0);
servo.setAngle(1,180);
servo.setAngle(1,90);
car.forword();
pcduino.usleep(3000000);
car.backward();
pcduino.usleep(3000000);
car.turnleft();
pcduino.usleep(3000000);
car.turnright();
pcduino.usleep(3000000);
car.stop();
pcduino.usleep(3000000);
servo.setAngle(1,0);
servo.setAngle(0,45);
servo.setAngle(2,15);
servo.setAngle(2,0);
servo.setAngle(0,0);
