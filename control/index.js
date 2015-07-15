var tree = require('./lib/tree');
var manipulator = require('./lib/manipulator');
var end_effector = require('./lib/end-effector');
var car = require('./lib/car');
var head = require('./lib/head');

////////////////////////////////
//
// 如果到了边界则进行旋转、变道等操作
//
////////////////////////////////

// var rightFirst = false;
// setInterval(function() {
//     if (head.isOnWhite()) {
//         if (car.isAuto()) {
//             console.log('is on white and is auto!');
//             car.stopAuto();
//             car.turn180(rightFirst);
//             rightFirst = !rightFirst;
//             car.autoForward();
//         }
//     }
// }, 20);

////////////////////////////////////////
//
// 如果发现树且在自动状态，则执行相关操作
//
///////////////////////////////////////

// setInterval(function() {
//     if (tree.isTree()) { // if tree detected
//         console.log(tree.getTree());
//         console.log({isTree: tree.isTree()});
//         if (car.isAuto()) {
//             console.log('isTree and isAuto');
//             car.stopAuto();
//             car.go(true, true, 1, 1, 100, 100, true); // sync forward 100 steps
//             end_effector.open(); // sync open
//             manipulator.move(1100); // sync move manipulator
//             end_effector.close(); // sync close
//             manipulator.move(-1100); // sync move back
//             end_effector.open(); // sync open
//             car.autoForward();
//         }
//     }
// }, 20);

//////////////////////////////////
//
// 启动进程
//
/////////////////////////////////

car.turnLeft90Sync();
car.autoForward();

process.on('message', function(msg) {
    console.log('index.js: Command Received -- ', msg);
    if (msg.command == "pause") {
        console.log('index.js: Command Pause.');
        if (car.isAuto()) {
            car.stopAuto();
            car.stop();
        }
    }
    if (msg.command == "resume") {
        console.log('index.js: Command Resume.');
        car.autoForward();
    }
});
