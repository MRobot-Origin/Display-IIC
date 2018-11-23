//blocks supporting a HC-SR04 ultrasonic distance sensor

const enum DistanceUnit {
    //% block="cm"
    CM = 58,       // Duration of echo round-trip in Microseconds (uS) for two centimeters, 343 m/s at sea level and 20°C
    //% block="inch"
    INCH = 148     // Duration of echo round-trip in Microseconds (uS) for two inches, 343 m/s at sea level and 20°C
}

namespace MRobot {

    const MAX_ULTRASONIC_TRAVEL_TIME = 300 * DistanceUnit.CM

    /**
     * Measures the distance and returns the result in a range from 1 to 300 centimeters or up to 118 inch.
     * The maximum value is returned to indicate when no object was detected.
     * @param unit unit of distance, eg: DistanceUnit.CM
     * @param trig pin connected to trig, eg: MRobotPin.P5
     * @param echo Pin connected to echo, eg: MRobotPin.P8
     */
    //% subcategory="超声波"
    //% blockId="ultrasonic_distance" block="超声波测距为 %unit | Trig接口为 %trig | Echo 接口为 %echo"
    //% trig.fieldEditor="gridpicker" trig.fieldOptions.columns=3
    //% trig.fieldOptions.tooltips="false"
    //% echo.fieldEditor="gridpicker" echo.fieldOptions.columns=3
    //% echo.fieldOptions.tooltips="false"
    //% weight=45
    export function getUltrasonicDistance(unit: DistanceUnit, trig: MRobotPin, echo: MRobotPin): number {
        const travelTime = medianTravelTime(() => ping(trig, echo))
        return Math.idiv(travelTime, unit)
    }

    function medianTravelTime(measure: () => number) {
        const travelTimes: number[] = []

        for (let i = 0; i < 3; i++) {
            basic.pause(25) // wait for echos to disappear
            const travelTime = measure()
            if (travelTime > 0) {
                travelTimes.push(travelTime)
            }
        }

        travelTimes.sort()

        return travelTimes.length > 0
            ? travelTimes[travelTimes.length >> 1]
            : MAX_ULTRASONIC_TRAVEL_TIME
    }

    function ping(trig: MRobotPin, echo: MRobotPin): number {
        // Reset trigger pin
        pins.setPull(trig as number, PinPullMode.PullNone)
        pins.digitalWritePin(trig as number, 0)
        control.waitMicros(2)

        // Trigger pulse
        pins.digitalWritePin(trig as number, 1)
        control.waitMicros(10)
        pins.digitalWritePin(trig as number, 0)

        // Measure travel time of echo
        return pins.pulseIn(echo as number, PulseValue.High, MAX_ULTRASONIC_TRAVEL_TIME)
    }
}