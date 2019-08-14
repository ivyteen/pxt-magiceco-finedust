import { pause } from './pxt_modules/core/game';
/**
 * Custom blocks
 */
//% weight=90 color=#ff7a4b icon="\uf0ee" block="미세먼지"
namespace Finedust {

    export enum WORKING_MODE {
        ACTIVE_MODE,
        QUERY_MODE
    }
    
    //let pm01: number = null
    let pm25: number = null;
    let pm10: number = null;
    let readBuffers: Buffer = null;
    let reportMode: number = 0;


    /**
    * TODO : Initialize PM Sensor
    * @param tx describe parameter here, eg: SerialPin.P15
    * @param rx describe parameter here, eg: SerialPin.P16
    */
    //% blockId="initSensor"
    //% block="미세먼지 센서 초기화 - 송신:%tx|, 수신:%rx"
    export function initSensor(tx: SerialPin, rx: SerialPin): void {

        serial.redirect(
            tx,
            rx,
            BaudRate.BaudRate9600);
        
    }


    /**
     * send command, Set Report Mode To Query 
     */
    //% weight=99 blockId=setQueryMode  block="쿼리 모드로 설정"
    export function setQueryMode():number {
        let ret = 0;
        ret = setReportMode(0x1);

        reportMode = ret;

        return ret;
    }

    /**
     * send command, Set Report Mode To Active 
     */
    //% weight=99 blockId=setActiveMode  block="액티브 모드로 설정"
    export function setActiveMode():number {
        let ret = 0;
        ret = setReportMode(0x0);

        reportMode = ret;

        return ret;
    }

    /**
     * send command, Set Report Mode
     */
    function setReportMode(mode:uint8):number {

        let buf:Buffer = pins.createBuffer(19);
        let tmpBuf:Buffer = null;
        let ret = 0;
        
        buf.fill(0);

        buf[0] = 0xAA;  //Head
        buf[1] = 0xB4;  //Command ID 
        buf[2] = 0x2;   //Data start
        buf[3] = 0x1;

        buf[4] = mode;   //set to query mode 0:active 1:query
        /** buf[5] ~ buf[14] are 0x0 */
        buf[15] = 0xFF;
        buf[16] = 0xFF; // Data end

        tmpBuf = buf.slice(2, 15);
        
        buf[17] = getCRC(tmpBuf);
        buf[18] = 0xAB; // Tail

        serial.writeBuffer(buf);
        ret = (getCurrentReportMode() === 0x1) ? WORKING_MODE.QUERY_MODE : WORKING_MODE.ACTIVE_MODE;
        
        return ret;
    }


   

    
    

    function getCRC(dataBuf: Buffer): uint8 {

        let crc = 0;

        for (let i = 0; i < dataBuf.length; i++){
            crc += dataBuf[i];
        }

        return crc;
    }

   
    function getCurrentReportMode(): uint8 {
        let mode = 0;
        //let hexString: string = null;

        let buf:Buffer = pins.createBuffer(19);
        let tmpBuf:Buffer = null;
        let ret = 0;
        
        buf.fill(0);

        buf[0] = 0xAA;  //Head
        buf[1] = 0xB4;  //Command ID 
        buf[2] = 0x2;   //Data start
        /** buf[3] ~ buf[14] are 0x0 */
        buf[15] = 0xFF;
        buf[16] = 0xFF; // Data end
        buf[17] = 0x0;
        buf[18] = 0xAB; // Tail

        serial.writeBuffer(buf);
        basic.pause(10);
        buf = serial.readBuffer(10);
        mode = buf.getUint8(4);


        return mode;
    }


    /**
     * get pm2.5 value (μg/m³) 
     */
    //% blockId="readpm25" block="pm2.5(μg/m³)값 읽기"
    export function ReadPM25(): number {
        //let pm25 = 0
        
        
        return pm25;
    }


    /**
     * get pm10 value (μg/m³) 
     */
    //% blockId="readpm10" block="pm10(μg/m³)값 읽기"
    export function ReadPM10(): number {
        //let pm10 = 0

     
        return pm10;
    }




}
