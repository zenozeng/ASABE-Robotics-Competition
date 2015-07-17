var tree = require('./lib/tree');
var manipulator = require('./lib/manipulator');
var end_effector = require('./lib/end-effector');
var car = require('./lib/car');
var head = require('./lib/head');

var row = 0; // row 从 1 到 5
var leftToRight = false;

var logs = [];

console.log('Car process started.');

var tasks = [
    function() {
        console.log('task: turn180 (leftFirst), block = 0');
        row = 1; // 接下来机械臂指向 row#1
        var rightFirst = false;
        var blocks = 0;
        car.turn180(rightFirst, blocks);
        car.resetSteps();
        leftToRight = true;
        console.log('task: autoForward Black Row #1');
        car.autoForward();
    },
    function() {
        row = 4;
        var rightFirst = true;
        var blocks = 2;
        car.turn180(rightFirst, blocks);
        car.resetSteps();
        leftToRight = false;
        car.autoForward();
    },
    function() {
        row = 3;
        var rightFirst = true;
        var blocks = 0;
        car.turn180(rightFirst, blocks);
        car.resetSteps();
        leftToRight = true;
        car.autoForward();
    },
    function() {
        row = 5;
        var rightFirst = true;
        var blocks = 1;
        car.turn180(rightFirst, blocks);
        car.resetSteps();
        leftToRight = false;
        car.autoForward();
    },
    function() {
        car.goBack(); // Sync go back
        // todo: 下货
    }
];

////////////////////////////////
//
// 如果到了边界则进行旋转、变道等操作
//
////////////////////////////////

var lastRowDetectedTime = 0;

var rightFirst = false;
setInterval(function() {
    if (head.isOnWhite()) {

        if ((Date.now() - lastRowDetectedTime) < 10 * 1000) {
            // accept 起始区域的黑线
            // ignore first black line、turn 180 after black line
            return;
        }

        lastRowDetectedTime = Date.now();

        console.log('isOnwhite！');
        if (car.isAuto()) {
            var task = tasks.shift();
            if (task) {
                task();
            }
        }
    }
}, 20);

////////////////////////////////////////
//
// 如果发现树且在自动状态，则执行相关操作
//
///////////////////////////////////////

setInterval(function() {
    if (tree.isTree()) { // if tree detected
        console.log(tree.getTree());
        console.log({isTree: tree.isTree()});
        if (car.isAuto()) {
            console.log('isTree and isAuto');
            var treeInfo = {
                row: row,
                col: leftToRight ? car.getTreeIndex() : (6 - car.getTreeIndex()),
                tree: tree.getTree()
            };
            logs.push(treeInfo);
            car.stopAuto();
            car.go(true, true, 1, 1, 100, 100, true); // sync forward 100 steps
            end_effector.open(); // sync open
            manipulator.move(1100); // sync move manipulator
            end_effector.close(); // sync close
            manipulator.move(-1100); // sync move back
            end_effector.open(); // sync open
            car.autoForward();
        }
    }
}, 20);

//////////////////////////////////
//
// 启动进程
//
/////////////////////////////////

row = 2;
car.turnLeft90Sync();
car.autoForward();
