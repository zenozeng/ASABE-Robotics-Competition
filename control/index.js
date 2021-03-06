var tree = require('./lib/tree');
var manipulator = require('./lib/manipulator');
var end_effector = require('./lib/end-effector');
var car = require('./lib/car');
var head = require('./lib/head');
var belt = require('./lib/belt');
var cube = require('./lib/cube');
var fs = require('fs');

require('yapcduino')({global: true});

var vision = require('./lib/vision');

var row = 0; // row 从 1 到 5
var leftToRight = false;

var logs = [];
var autoForward = false;

var checkSteps = true;
// y = 3977.5x + 809.5

console.log('Car v2 process started.');

var log = function(msg) {
    logs.push({message: msg});
    console.log(msg);
    syncLog();
};

var looping = true;

var tasks = [
    function() {
        log('Task 2 - Total progress 17%');
        log('Car: turn180 (leftFirst), block = 0');
        row = 1; // 接下来机械臂指向 row#1
        var rightFirst = false;
        car.turn180(rightFirst, 0);
        car.resetSteps();
        leftToRight = true;
        log('Car: auto forward mode (row#1).');
        autoForward = true;
    },
    function() {
        log('Task 3 - Total progress 33%');
        row = 4;
        var rightFirst = true;
        var blocks = 2;
        car.forwardBlocks(2);
        car.resetSteps();
        leftToRight = false;
        log('Car: auto forward mode (row#4).');
        autoForward = true;
    },
    function() {
        log('Task 4 - Total progress 50%');
        row = 3;
        var rightFirst = true;
        log('Car: turn180 (right first), block = 0');
        car.turn180(rightFirst, 0);
        car.resetSteps();
        leftToRight = true;
        log('Car: auto forward mode (row#3).');
        autoForward = true;
    },
    function() {
        log('Task 5 - Total progress 67%');
        row = 5;
        log('Car: forwardBlocks(1)');
        car.forwardBlocks(1);
        car.resetSteps();
        leftToRight = false;
        log('Car: auto forward mode (row#5).');
        autoForward = true;
    },
    function() {
        log('Task 6 - Total progress 83%');
        car.go(false, false, 0.25, 0.25, 2000, 2000);
        car.autoForwardAutoStopSync(2000, 0.25);
        car.forwardBlocks(3); // go to black row #1
        belt.unload();
        log('All tasks done - Total progress 100%');
        looping = false;
        syncLog();
    }
];


var lastRowDetectedTime = Date.now();

var rightFirst = false;
var collectedTypes = [];

var loop = function(debug) {

    // console.log('interval');
    // console.log(head.isCrossing());

    ////////////////////////////////
    //
    // 如果到了边界则进行旋转、变道等操作
    //
    ////////////////////////////////

    var stepsDone = car.getSteps() > 22685;

    console.log(car.getSteps(), stepsDone);

    if (checkSteps) {
        if (stepsDone) {
            // 退回到黑线上
            while (!head.isCrossing()) {
                car.go(false, false, 0.25, 0.25);
            }
            autoForward = false;
            car.stop();

            var task = tasks.shift();
            if (task) {
                task();
            }
        }
    }

    // if (head.isCrossing()) {
    //     console.log('isCrossing！');
    //     lastRowDetectedTime = Date.now();
    //     autoForward = false;
    //     car.stop();
    //     var task = tasks.shift();
    //     if (task) {
    //         task();
    //     }
    // }


    ////////////////////////////////
    //
    // 自动循迹
    //
    ////////////////////////////////

    if (autoForward) {
        car._autoForward();
    }

    ////////////////////////////////////////
    //
    // 如果发现树且在自动状态，则执行相关操作
    //
    ///////////////////////////////////////

    // tree.getTree(); // update cam

    // if (false) {
    if (tree.exists()) { // if tree detected

        var isHigh = false;

        // 摄像头对准树
        car.autoForwardSyncWithFn(400, 1, function() {
            if (tree.isHigh()) {
                isHigh = true;
            }
        });

        var start = Date.now();
        var treeInfo;
        while ((Date.now() - start) < 1000) {
            treeInfo = tree.getTree();
        }

        if (debug) {
            // log current treeInfo
            console.log('>>> TREE DEBUG BEGIN <<<');
            console.log(treeInfo);
            console.log('>>> TREE DEBUG END <<<');
        }

        treeInfo.row = row;
        treeInfo.col = leftToRight ? car.getTreeIndex() : (6 - car.getTreeIndex());
        treeInfo.color = treeInfo.color && treeInfo.color.toLowerCase();
        treeInfo.steps = car.getSteps();
        treeInfo.treeIndex = car.getTreeIndex();
        logs.push({tree: treeInfo});
        console.log(treeInfo);

        // 运行到树对准传送带红外检测到
        while (!tree.shouldStop()) {
            car._autoForward(0.25);
            if (tree.isHigh()) {
                isHigh = true;
            }
        }

        // 运行到树正对红外线
        car.autoForwardSyncWithFn(1100, 1, function() {
            if (tree.isHigh()) {
                isHigh = true;
            }
        });

        treeInfo.isHigh = isHigh;
        treeInfo.height = isHigh ? "high" : "low";

        // log types
        var type = JSON.stringify({
            color: treeInfo.color,
            height: treeInfo.height
        });

        syncLog();

        var CHECK_COLLECTED_BEFORE = true;
        if (CHECK_COLLECTED_BEFORE && (collectedTypes.indexOf(type) == -1)) {
            collectedTypes.push(type);
            car.stop();
            cube.collect();
        }

        // 恢复自动运行
        autoForward = true;
    }

    //////////////////////////////////
    //
    // 与 Server 通信
    //
    /////////////////////////////////

    syncLog();
};

// sync status
function syncLog() {
    var data = {};
    data.tree = tree.getTree();
    delete data.tree.time;
    data.car = {
        steps: car.getSteps(),
        currentStep: car.getCurrentSteps(),
        isOnBlackLine: head.isOnBlackLine()
    };
    fs.writeFileSync('/run/shm/data.json', JSON.stringify({logs: logs, status: data}));
};

var started = false;
function init(debug) {
    started = true;

    console.log('index.js: Command Go.');
    end_effector.close();
    end_effector.stop();

    if (!debug) {
        log('Task 1 - Total progress 0%');
        log('Car: turn left 90deg now.');
        car.turnLeft90Sync();
        car.rotateToFindLine(30, false);
    }

    log('Car: auto forward mode (row#2).');
    row = 2;
    car.resetSteps();
    autoForward = true;

    while (looping) {
        loop(debug);
        process.nextTick();
    }
};

var prepare = function() {
    if (!started) {
        tree.getTree(); // force vision to init, to reduce the init time
        setTimeout(prepare, 100);
    }
};
prepare();

process.on('message', function(msg) {
    console.log('index.js: Command Received -- ', msg);
    if (msg.command == "test") {
        log('Unit tests started.');

        log('Unit test: go(1, 1)');
        car.go(true, true, 1, 1, 1000, 1000, true);

        log('Unit test: go(1, 0)');
        car.go(true, true, 1, 0, 1000, 0, true);

        log('Unit test: go(0, 1)');
        car.go(true, true, 0, 1, 0, 1000, true);

        log('Unit test: go(1, 1) (backward)');
        car.go(false, false, 1, 1, 1000, 1000, true);

        log('Unit test: end effector open');
        end_effector.open();

        log('Unit test: end effector close');
        end_effector.close();

        log('Unit test: end effector slow open');
        end_effector.slowOpen();

        log('Unit test: end effector close (again)');
        end_effector.close();

        log('Unit test: end effector stop)');
        end_effector.stop();

        log('Unit test: belt load');
        belt.load();
        delayMicroseconds(1 * 1000 * 1000);

        log('Unit test: belt stop');
        belt.stop();

        log('Unit test: manipulator');
        manipulator.move(1000);
        manipulator.move(-1000);

        log('Unit test: all tests finished');
    }
    if (msg.command == "go") {
        log('Car> message from server: command go.');
        init();
    }
    if (msg.command == "debug") {
        log('Car> message from server: command debug.');
        init(true);
    }
    if (msg.command == "pause") {
        console.log('index.js: Command Pause.');
        autoForward = false;
        car.stop();
    }
    if (msg.command == "resume") {
        console.log('index.js: Command Resume.');
        autoForward = true;
    }
});
