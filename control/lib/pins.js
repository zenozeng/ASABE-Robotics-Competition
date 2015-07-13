module.exports = {

    // 左轮步进电机脉冲
    LEFT_STEPPING_MOTOR_CLK: 0,

    // 左轮步进电机方向
    LEFT_STEPPING_MOTOR_CW: 1,

    // 右轮步进电机脉冲
    RIGHT_STEPPING_MOTOR_CLK: 2,

    // 右轮步进电机方向
    RIGHT_STEPPING_MOTOR_CW: 4,

    // 机械臂步进电机脉冲
    MANIPULATOR_STEPPING_MOTOR_CLK: 7,

    // 机械臂步进电机方向
    MANIPULATOR_STEPPING_MOTOR_CW: 8,

    // 夹持装置控制舵机
    END_EFFECTOR_SERVO: 5,

    // 红外线
    // 注意这个是 A0 口，不是 GPIO 0 口
    IR: 0,

    // 循迹片从到右
    BLACK_AND_WHITE_SENSOR_1: 14,
    BLACK_AND_WHITE_SENSOR_2: 15,
    BLACK_AND_WHITE_SENSOR_3: 16,
    BLACK_AND_WHITE_SENSOR_4: 17

    // 尾部舵机或者减速电机: 12
    // 左超声波 Trig: 13
    // 左超声波 Echo: 14
};
