/**
 * Custom blocks
 */
//% weight=90 color=#ff7a4b icon="\uf0ee" block="미세먼지"
namespace FinedustPWM {

   
    /**
     * get pm2.5 value (μg/m³) 
     * @param pm25pin describe parameter here, eg: DigitalPin.P14
     */
    //% advanced=true
    //% blockId="readpm25" block="value of pm2.5(μg/m³) at pin %pm25pin"
    export function ReadPM25(pm25pin: DigitalPin): number {
        let pm25 = 0
        while (pins.digitalReadPin(pm25pin) != 0) {
        }
        while (pins.digitalReadPin(pm25pin) != 1) {
        }
        pm25 = input.runningTimeMicros()
        while (pins.digitalReadPin(pm25pin) != 0) {
        }
        pm25 = input.runningTimeMicros() - pm25
        pm25 = pm25 / 1000 - 2
        return pm25;
    }



    /**
     * get pm10 value (μg/m³) 
     * @param pm10pin describe parameter here, eg: DigitalPin.P13     
     */
    //% advanced=true
    //% blockId="readpm10" block="value of pm10(μg/m³) at pin %pm10pin"
    export function ReadPM10(pm10pin: DigitalPin): number {
        let pm10 = 0
        while (pins.digitalReadPin(pm10pin) != 0) {
        }
        while (pins.digitalReadPin(pm10pin) != 1) {
        }
        pm10 = input.runningTimeMicros()
        while (pins.digitalReadPin(pm10pin) != 0) {
        }
        pm10 = input.runningTimeMicros() - pm10
        pm10 = pm10 / 1000 - 2
        return pm10;
    }




}