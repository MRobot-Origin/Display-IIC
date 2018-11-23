    // MakerBit blocks supporting a I2C LCD 1602
///////////////////////////////LCD1602显示屏IIC接口///////////////////////////////// 
enum Lcd1602Position {
    //% block="0"
    P0 = 0,
    //% block="1"
    P1 = 1,
    //% block="2"
    P2 = 2,
    //% block="3"
    P3 = 3,
    //% block="4"
    P4 = 4,
    //% block="5"
    P5 = 5,
    //% block="6"
    P6 = 6,
    //% block="7"
    P7 = 7,
    //% block="8"
    P8 = 8,
    //% block="9"
    P9 = 9,
    //% block="10"
    P10 = 10,
    //% block="11"
    P11 = 11,
    //% block="12"
    P12 = 12,
    //% block="13"
    P13 = 13,
    //% block="14"
    P14 = 14,
    //% block="15"
    P15 = 15,
    //% block="16"
    P16 = 16,
    //% block="17"
    P17 = 17,
    //% block="18"
    P18 = 18,
    //% block="19"
    P19 = 19,
    //% block="20"
    P20 = 20,
    //% block="21"
    P21 = 21,
    //% block="22"
    P22 = 22,
    //% block="23"
    P23 = 23,
    //% block="24"
    P24 = 24,
    //% block="25"
    P25 = 25,
    //% block="26"
    P26 = 26,
    //% block="27"
    P27 = 27,
    //% block="28"
    P28 = 28,
    //% block="29"
    P29 = 29,
    //% block="30"
    P30 = 30,
    //% block="31"
    P31 = 31
}
 enum Lcd1602Backlight {
    //% block="关"
    Off = 0,
    //% block="开"
    On = 8
}
/////////////////////////////////////////////////////////////////////////////////
    // blocks supporting a I2C_LCD_1602、IIC_OLED_12864
    //% weight=20 color=#0855AB icon="O" block="IIC器件"
namespace MRobot {
/*LCD1602显示屏IIC接口驱动程序*/
    const enum Lcd1602 {
        Command = 0,
        Data = 1
    }
    const Lcd1602Rows = 2
    const Lcd1602Columns = 16
    interface Lcd1602State {
        i2cAddress: number
        backlight: Lcd1602Backlight
        characters: Buffer
        cursor: number
    }
    let lcd1602State: Lcd1602State = undefined
    // Write 4 bits (high nibble) to I2C bus
    function write4bits(value: number) {
        if (!lcd1602State) {
            return
        }
        pins.i2cWriteNumber(lcd1602State.i2cAddress, value, NumberFormat.Int8LE)
        pins.i2cWriteNumber(lcd1602State.i2cAddress, value | 0x04, NumberFormat.Int8LE)
        control.waitMicros(1)
        pins.i2cWriteNumber(lcd1602State.i2cAddress, value & (0xFF ^ 0x04), NumberFormat.Int8LE)
        control.waitMicros(50)
    }
    // Send high and low nibble
    function send(RS_bit: number, payload: number) {
        if (!lcd1602State) {
            return
        }
        const highnib = payload & 0xF0
        write4bits(highnib | lcd1602State.backlight | RS_bit)
        const lownib = (payload << 4) & 0xF0
        write4bits(lownib | lcd1602State.backlight | RS_bit)
    }
    // Send command
    function sendCommand(command: number) {
        send(Lcd1602.Command, command)
    }
    // Send data
    function sendData(data: number) {
        send(Lcd1602.Data, data)
    }
    // Set cursor
    function setCursor(line: number, column: number) {
        sendCommand((line === 0 ? 0x80 : 0xC0) + column)
    }
    /**
     * 在1602指定范围显示一段文本,
     * 如果文本的长度超过给定的显示范围，文本将会被裁剪,
     * 如果有空白区域，则填充为空.
     * @param text the text to show, eg: "MRobot"
     * @param startPosition the start position on the LCD1602, [0 - 31]
     * @param endPosition the end position on the LCD1602, [0 - 31]
     */
    //% subcategory="LCD1602"
    //% blockId="lcd1602_show_string"
    //% block="显示字符串 %text | 从 %startPosition=lcd1602_position | 到 %endPosition=lcd1602_position"
    //% weight=90 color=#00BFFF
    export function showStringOnLcd1602(text: string, startPosition: number, endPosition: number): void {
        const whitespace = ' '.charCodeAt(0)
        for (let textPosition = 0; startPosition + textPosition <= endPosition; textPosition++) {
            let character = text.charCodeAt(textPosition)
            if (textPosition >= text.length) {
                character = whitespace
            }
            updateCharacterIfRequired(character, startPosition + textPosition)
        }
    }
    function updateCharacterIfRequired(character: number, position: number): void {
        if (!lcd1602State || position < 0 || position >= Lcd1602Rows * Lcd1602Columns) {
            return
        }
        if (lcd1602State.characters[position] != character) {
            lcd1602State.characters[position] = character
            if (lcd1602State.cursor !== position || (lcd1602State.cursor % Lcd1602Columns) === 0) {
                setCursor(Math.idiv(position, Lcd1602Columns), position % Lcd1602Columns)
            }
            sendData(character)
            lcd1602State.cursor = position + 1
        }
    }
    /**
     * 在LCD1602指定区域显示一段数字.
     * 如果数字的长度超过给定的显示范围，数字将会被裁剪
     * 如果有空白区域，则填充为空
     * @param value the number to show
     * @param startPosition the start position on the LCD1602, [0 - 31]
     * @param endPosition the end position on the LCD1602, [0 - 31]
     */
    //% subcategory="LCD1602"
    //% blockId="lcd1602_show_number"
    //% block="显示数字 %value| 从 %startPosition=lcd1602_position | 到 %endPosition=lcd1602_position"
    //% weight=89 color=#00BFFF
    export function showNumberOnLcd(value: number, startPosition: number, endPosition: number): void {
        showStringOnLcd1602(value.toString(), startPosition, endPosition)
    }
    /**
     * 将LCD位置定位变为数字。
     * @param position the LCD1602 position, eg: Lcd1602Position.P0
     */
    //% subcategory="LCD1602"
    //% blockId=lcd1602_position
    //% block="%position"
    //% position.fieldEditor="gridpicker"
    //% position.fieldOptions.columns=16
    //% blockHidden=true
    export function position(position: Lcd1602Position): number {
        return position
    }
    /**
     * 清除LCD1602显示
     */
    //% subcategory="LCD1602"
    //% blockId="lcd1602_clear" block="清空LCD1602显示"
    //% weight=80 color=#00BFFF
    export function clearLcd1602(): void {
        showStringOnLcd1602('', 0, 31)
    }
    /**
     * 打开或者关闭LCD1602的背光
     * @param backlight new state of backlight, eg: Lcd1602Backlight.关
     */
    //% subcategory="LCD1602"
    //% blockId="lcd1602_backlight" block="设置LCD1602的背光为 %backlight"
    //% weight=79 color=#00BFFF
    export function setLcdBacklight(backlight: Lcd1602Backlight): void {
        if (!lcd1602State) {
            return
        }
        lcd1602State.backlight = backlight
        send(Lcd1602.Command, 0)
    }
    /**
     * 设置LCD1602的IIC地址
     * 大部分地址为 39 (PCF8574) 或者 63 (PCF8574A) 
     * @param i2cAddress I2C address of LCD in the range from 0 to 127, eg: 39
     */
    //% subcategory="LCD1602"
    //% blockId="lcd1602_set_address" block="连接LCD1602的IIC地址为 %i2cAddress"
    //% i2cAddress.min=0 i2cAddress.max=127
    //% weight=95 color=#00BFFF
    export function connectLcd(i2cAddress: number): void {
        lcd1602State = {
            i2cAddress: i2cAddress,
            backlight: Lcd1602Backlight.On,
            characters: pins.createBuffer(Lcd1602Rows * Lcd1602Columns),
            cursor: -1
        }

        // Wait 50ms before sending first command to device after being powered on
        basic.pause(50)

        // Pull both RS and R/W low to begin commands
        pins.i2cWriteNumber(lcd1602State.i2cAddress, lcd1602State.backlight, NumberFormat.Int8LE)
        basic.pause(50)

        // Set 4bit mode
        write4bits(0x30)
        control.waitMicros(4100)
        write4bits(0x30)
        control.waitMicros(4100)
        write4bits(0x30)
        control.waitMicros(4100)
        write4bits(0x20)
        control.waitMicros(1000)

        // Configure function set
        const LCD1602_FUNCTIONSET = 0x20
        const LCD1602_4BITMODE = 0x00
        const LCD1602_2LINE = 0x08
        const LCD1602_5x8DOTS = 0x00
        send(Lcd1602.Command, LCD1602_FUNCTIONSET | LCD1602_4BITMODE | LCD1602_2LINE | LCD1602_5x8DOTS)
        control.waitMicros(1000)

        // Configure display
        const LCD1602_DISPLAYCONTROL = 0x08
        const LCD1602_DISPLAYON = 0x04
        const LCD1602_CURSOROFF = 0x00
        const LCD1602_BLINKOFF = 0x00
        send(Lcd1602.Command, LCD1602_DISPLAYCONTROL | LCD1602_DISPLAYON | LCD1602_CURSOROFF | LCD1602_BLINKOFF)
        control.waitMicros(1000)

        // Set the entry mode
        const LCD1602_ENTRYMODESET = 0x04
        const LCD1602_ENTRYLEFT = 0x02
        const LCD1602_ENTRYSHIFTDECREMENT = 0x00
        send(Lcd1602.Command, LCD1602_ENTRYMODESET | LCD1602_ENTRYLEFT | LCD1602_ENTRYSHIFTDECREMENT)
        control.waitMicros(1000)

        // Clear display and buffer
        const whitespace = 'x'.charCodeAt(0)
        for (let pos = 0; pos < Lcd1602Rows * Lcd1602Columns; pos++) {
            lcd1602State.characters[pos] = whitespace
        }
        clearLcd1602()
    }
}
