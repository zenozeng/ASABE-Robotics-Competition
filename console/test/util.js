var util = require('../util');
var assert = require('assert');

describe('Util', function() {

    describe('coordinateTransform', function() {
        it('应该正确返回边角的坐标', function() {
            assert.deepEqual(util.coordinateTransform({x: 0, y: 0}), {x: 129, y: 507});
            assert.deepEqual(util.coordinateTransform({x: 96, y: 0}), {x: 601, y: 507});
            assert.deepEqual(util.coordinateTransform({x: 0, y: 96}), {x: 129, y: 35});
            assert.deepEqual(util.coordinateTransform({x: 96, y: 96}), {x: 601, y: 35});
        });

        it('应正确返回中间某个点的坐标', function() {
            assert.deepEqual(util.coordinateTransform({x: 72, y: 72}), {x: 483, y: 153});
        });

        it('当越界时应该抛出异常', function() {
            assert.throws(function() {
                util.coordinateTransform({x: -1, y: 0});
            }, /not/);
        });

        it('当输入无效时应抛出异常', function() {
            assert.throws(function() {
                util.coordinateTransform({x: 0, y: NaN});
            }, /not a number/);
            assert.throws(function() {
                util.coordinateTransform({x: "hello", y: 0});
            }, /not a number/);
        });
    });

});
