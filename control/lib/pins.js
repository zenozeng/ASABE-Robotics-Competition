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
    END_EFFECTOR_SERVO: 3,

    // 红外线
    IR: 5, // digital#5

    // 注意这个是 A0 口，不是 GPIO 0 口
    // IR: 4,

    // 循迹片
    BLACK_AND_WHITE_SENSOR_1: 14, // 前左
    BLACK_AND_WHITE_SENSOR_2: 15, // 前右
    BLACK_AND_WHITE_SENSOR_3: 16, // 后左
    BLACK_AND_WHITE_SENSOR_4: 17, // 后右
    BLACK_AND_WHITE_SENSOR_5: 13  // 前外左

    // 尾部舵机或者减速电机: 12
    // 左超声波 Trig: 13
    // 左超声波 Echo: 14
};
