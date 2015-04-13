/**
 * Coordinate Transform 实际坐标 -> Canvas 坐标
 *
 * @param {Object} coordinate - 实际坐标系坐标（inch）
 * @param {Float} coordinate.x - 以图中左侧外线为零，向右为正，x∈[0, 96]
 * @param {Float} coordinate.y - 以图中下侧外线为零，向上为正，y∈[0, 96]
 * @returns {Object} - {x, y} Canvas 坐标系（pixel, int），以图片最左上为 (0, 0)，向右下为正
 */
var coordinateTransform = function(coordinate) {

    // 边界检查
    [coordinate.x, coordinate.y].forEach(function(val) {
        val = parseFloat(val);
        if (isNaN(val)) {
            throw new Error("Given coordinate is not a number, x∈[0, 96], y∈[0, 96]");
        }
        if (val < 0 || val > 96) {
            throw new Error("Given coordinates not in target area, x∈[0, 96], y∈[0, 96]");
        }
    });

    // 图像边界（像素）
    var left = 129,
        top = 35,
        bottom = 507,
        right = 601;

    var width = right - left,
        height = bottom - top;

    // 变换坐标系方向
    var x = parseFloat(coordinate.x),
        y = 96 - parseFloat(coordinate.y);

    // 变换单位、原点
    return {
        x: parseInt(left + x / 96 * width),
        y: parseInt(top + y / 96 * height)
    };
};

module.exports = {
    coordinateTransform: coordinateTransform
};
