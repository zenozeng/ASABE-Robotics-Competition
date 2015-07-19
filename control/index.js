var tree = require('./lib/tree');
var manipulator = require('./lib/manipulator');
var end_effector = require('./lib/end-effector');
var car = require('./lib/car');
var head = require('./lib/head');

var vision = require('./lib/vision');

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

var lastRowDetectedTime = Date.now();

var rightFirst = false;
setInterval(function() {
    if (head.isCrossing()) {

        if ((Date.now() - lastRowDetectedTime) < 10 * 1000) {
            // ignore first black line、turn 180 after black line
            return;
        }

        lastRowDetectedTime = Date.now();

        console.log('isCrossing！');

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

var collectedTypes = [];

setInterval(function() {
    if (tree.shouldStop()) { // if tree detected and tree is in center
        if (car.isAuto()) {

            console.log('tree.shouldStop() and isAuto');

            // log tree
            var treeInfo = tree.getTree();
            treeInfo.row = row;
            treeInfo.col = leftToRight ? car.getTreeIndex() : (6 - car.getTreeIndex());
            treeInfo.color = treeInfo.color.toLowerCase();
            logs.push({tree: treeInfo});
            console.log(treeInfo);

            // log types
            var type = JSON.stringify({
                color: treeInfo.color,
                height: treeInfo.height
            });

            if (collectedTypes.indexOf(type) > -1) {
                return; // already collected before
            }

            collectedTypes.push(type);

            // 暂停
            car.stopAuto();
            car.stop();
            // 运行到树对准传送带
            car.autoForwardSync(1600);
            // 对准小木块
            end_effector.open(); // sync open
            manipulator.move(1100); // sync move manipulator
            end_effector.close(); // sync close
            manipulator.move(-1100); // sync move back
            end_effector.open(); // sync open
            // 往前开一小段避免树被再次判断到
            car.autoForwardSync(3000);
            // 恢复自动运行
            car.autoForward();
        }
    }
}, 20);

//////////////////////////////////
//
// 与 Server 通信
//
/////////////////////////////////

// sync status
setInterval(function() {
    var data = {};
    data.tree = tree.getTree();
    delete data.tree.time;
    data.car = {
        steps: car.getSteps(),
        currentStep: car.getCurrentSteps(),
        isOnBlackLine: head.isOnBlackLine()
    };
    process.send({
        logs: logs,
        status: data
    });
}, 100);

process.on('message', function(msg) {
    console.log('index.js: Command Received -- ', msg);
    if (msg.command == "go") {
        console.log('index.js: Command Go.');
        row = 2;
        car.turnLeft90Sync();
        car.autoForward();
    }
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
