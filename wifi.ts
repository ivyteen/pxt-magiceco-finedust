/**
 * Use this file to define custom functions and blocks.
 * Read more at https://makecode.microbit.org
 */



/**
 * Custom blocks
 */
//% color=#0fbc11 icon="\uf1eb" weight=90 block="WiFi"

namespace WiFi {
    let tobesendstring = ""

    /**
     * TODO: Set pin RX and TX for ESP8266 Serial Wifi Module，Baud rate: 115200.
     * @param wifiRX describe parameter here, eg: SerialPin.P8
     * @param wifiTX describe parameter here, eg: SerialPin.P12
     */
    //% weight=100
    //% blockId="wifi_init" block="WiFi 설정 - 수신: %wifiRX|, 송신: %wifiTX|, 통신속도: %baudrate"
    export function initwifi(wifiRX: SerialPin, wifiTX: SerialPin, baudrate: BaudRate): void {
        serial.redirect(
            wifiRX,
            wifiTX,
            //BaudRate.BaudRate115200
            baudrate
        )
        basic.pause(10)
        serial.writeString("AT+RST" + "\u000D" + "\u000A")
        basic.pause(2000)
        serial.writeString("AT+CWMODE=1" + "\u000D" + "\u000A")
        basic.pause(5000)

        // Add code here
    }

    /**
     * TODO: connectwifi，Fill in your ssid and your key.
     * @param ssid describe parameter here, eg: "SSID 이름"
     * @param key describe parameter here, eg: "보안 키"
     */
    //% weight=99
    //% blockId="wifi_connect" block="WiFi 연결 - SSID: %ssid| 보안 키: %key"
    export function connectwifi(ssid: string, key: string): void {
        // Add code here
        let text = "AT+CWJAP=\""
                 + ssid
                 + "\",\""
                 + key
                 + "\""
        
        serial.writeString(text + "\u000D" + "\u000A")
        basic.pause(6000)
    }

    /**
     * TODO: connect thingspeak IoT TCP server 
    */
    //% weight=98
    //% blockId="TCP_connect" block="Thingspeak에 연결"
    export function connectthingspeak(): void {
        // Add code here
        let text = "AT+CIPSTART=\"TCP\",\"api.thingspeak.com\",80"
        serial.writeString(text + "\u000D" + "\u000A")
        basic.pause(6000)
    }

    /**
     * TODO: Set data to be sent.
     * @param write_api_key describe parameter here, eg: "API 키 입력"
     * @param n1 describe parameter here, eg: 0
     * @param n2 describe parameter here, eg: 0
     * @param n3 describe parameter here, eg: 0
     * @param n4 describe parameter here, eg: 0
     * @param n5 describe parameter here, eg: 0
     * @param n6 describe parameter here, eg: 0
     * @param n7 describe parameter here, eg: 0
     * @param n8 describe parameter here, eg: 0
     */
    //% weight=97
    //% blockId="send_text" block="전송할 데이터 설정 - API 키: %write_api_key|필드1 = %n1|필드2 = %n2|필드3 = %n3|필드4 = %n4|필드5 = %n5|필드6 = %n6|필드7 = %n7|필드8 = %n8"
    export function tosendtext(write_api_key: string,
                                n1: number, 
                                n2: number, 
                                n3: number, 
                                n4: number, 
                                n5: number, 
                                n6: number, 
                                n7: number, 
                                n8: number ): void {
        let text=""   
        text = "GET /update?key="
            + write_api_key
            + "&field1="
            + n1
            + "&field2="
            + n2
            + "&field3="
            + n3
            + "&field4="
            + n4  
            + "&field5="
            + n5
            + "&field6="
            + n6
            + "&field7="
            + n7
            + "&field8="
            + n8  
        tobesendstring = text              
        // Add code here
    }

    /**
     * TODO: send data
     */
    //% weight=96
    //% blockId=senddata block="Thingspeak로 데이터 전송"
    export function senddata(): void {
        let text = ""
        text = "AT+CIPSEND=" 
            + (tobesendstring.length + 2)
        serial.writeString(text + "\u000D" + "\u000A")
        basic.pause(3000)
        serial.writeString(tobesendstring + "\u000D" + "\u000A")
        basic.pause(6000)
        // Add code here

    }


}