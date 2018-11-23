// MRobot core blocks

const enum MRobotPin {
    A0 = DigitalPin.P0,
    A1 = DigitalPin.P1,
    A2 = DigitalPin.P2,
    A3 = DigitalPin.P3,
    A4 = DigitalPin.P4,
    P5 = DigitalPin.P5,
    P6 = DigitalPin.P6,
    P7 = DigitalPin.P7,
    P8 = DigitalPin.P8,
    P9 = DigitalPin.P9,
    P10 = DigitalPin.P10,
    P11 = DigitalPin.P11,
    P12 = DigitalPin.P12,
    P13 = DigitalPin.P13,
    P14 = DigitalPin.P14,
    P15 = DigitalPin.P15,
    P16 = DigitalPin.P16,
    SDL = DigitalPin.P19,
    SDA = DigitalPin.P20
}

const enum PinLevel {
    //% block="high"
    High = 1,
    //% block="low"
    Low = 0
}

namespace MRobot {
    /**
     * Turns a digital pin level into a number.
     * @param level the pin level, eg: PinLevel.High
     */
    //% blockId=makerbit_helper_level
    //% block="%level"
    //% blockHidden=true
    export function level(level: PinLevel): number {
        return level
    }
}