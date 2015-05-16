// pin define

// 0, 1, 2 口为舵机控制 pin

module.exports = {
    // 机械臂舵机
    MANIPULATOR_SERVO: 0,

    // Tank 底座旋转控制舵机
    TANK_SERVO: 1,

    // 夹持装置控制舵机
    END_EFFECTOR_SERVO: 2,

    // 左黑白循迹片
    LEFT_BLACK_AND_WHITE_SENSOR: 3,

    // 中循迹片
    MIDDLE_BLACK_AND_WHITE_SENSOR: 4,

    // 右循迹片
    RIGHT_BLACK_AND_WHITE_SENSOR: 5,

    // Tank 底座步进电机脉冲输入信号
    TANK_STEPPING_MOTOR_CLK: 6,

    // Tank 底座步进电机方向输入信号
    TANK_STEPPING_MOTOR_CW: 7,

    // 左轮步进电机脉冲
    LEFT_STEPPING_MOTOR_CLK: 8,

    // 左轮步进电机方向
    LEFT_STEPPING_MOTOR_CLK: 9,

    // 右轮步进电机脉冲
    LEFT_STEPPING_MOTOR_CLK: 10,

    // 右轮步进电机方向
    LEFT_STEPPING_MOTOR_CLK: 11
};
