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
    let pm25: number = -1;
    let pm10: number = -1;
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
     * TODO: send command, Set Report Mode To Query 
     */
    //% weight=99 blockId=setQueryMode  block="수동 모드로 설정"
    export function setQueryMode():string {
       // let ret = 0;
        let mode = "";

        reportMode = setReportMode(0x1);
        
        if (reportMode === WORKING_MODE.QUERY_MODE)
            mode = "Query";
        else
            mode = "NG";

        return mode;
    }

    /**
     * TODO: send command, Set Report Mode To Active 
     */
    //% weight=99 blockId=setActiveMode  block="자동 모드로 설정"
    export function setActiveMode():string {
        //let ret = 0;
        let mode = "";
        reportMode = setReportMode(0x0);

        if (reportMode === WORKING_MODE.ACTIVE_MODE)
            mode = "Active";
        else
            mode = "NG";
        
        return mode;
    }


    /**
     * TODO: Read finedust Value from the sensor 
     */
    //% weight=99 blockId=readInActive  block="자동으로 미세먼지 값 읽기"
    /*
    export function readInActive(): void {

        
        //let bufdata: number = 0
        let j: number = 0
        let hexString: string = null
        let receivedString: string[] = []
        
        serial.onDataReceived("AA", function () {
            readBuffers = serial.readBuffer(9);
            //serial.writeBuffer(readBuffers)
            hexString = readBuffers.toHex();
            for (let i = 0; i < readBuffers.length * 2; i += 2) {
                receivedString[j] = hexString[i] + hexString[i + 1]
                j++;
            }
            if (receivedString[0] == "C0") {
                pm25 = convertToDecimal(receivedString[2] + receivedString[1])
                pm10 = convertToDecimal(receivedString[4] + receivedString[3])
            }
          
                
        })        
        
        


    }
    */

/**
     * TODO: Read finedust Value from the sensor 
     */
    //% weight=99 blockId=readFromQuery  block="수동으로 미세먼지 값 읽기"
    export function readFromQuery(): void {
      
        let buf:Buffer = pins.createBuffer(19);
        let tmpBuf:Buffer = null;
        let ret = 0;
        
        buf.fill(0);

        buf[0] = 0xAA;  //Head
        buf[1] = 0xB4;  //Command ID 
        buf[2] = 0x4;   //Data start
       
        /** buf[3] ~ buf[14] are 0x0 */
        buf[15] = 0xFF;
        buf[16] = 0xFF; // Data end

        tmpBuf = buf.slice(2, 15);
        
        buf[17] = getCRC(tmpBuf);
        buf[18] = 0xAB; // Tail

        serial.writeBuffer(buf);
        basic.pause(10);
        getPMData();
        
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


    /**
     * get PM data
    */
    function getPMData() {

        readBuffers = serial.readBuffer(10);
        
        if ((readBuffers.getUint8(0) === 0xAA)&&(readBuffers.getUint8(1) === 0xC0)&&(readBuffers.getUint8(9) === 0xAB)) {
            //pm10 = readBuffers.getUint8(3);
            //pm25 = readBuffers.getUint8(2);
            pm25 = ((readBuffers.getUint8(3) * 256) + readBuffers.getUint8(2)) / 10;
            pm10 = ((readBuffers.getUint8(5) * 256) + readBuffers.getUint8(4)) / 10;
        }
        else {
            pm10 = -1;
            pm25 = -1;    
        }

    }


    /**
     * send command, Set Report Mode
     */
    function setReportMode(mode:number):number {

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

   
    function getCurrentReportMode(): number {
        let mode;
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
        tmpBuf = serial.readBuffer(10);
        mode = tmpBuf.getUint8(4);


        return mode;
    }


     /**
     * convert string to decimal
     */
    function convertToDecimal(inString: string): number {

        let decimal = 0
        let position = 0

        for (let i = inString.length - 1; i >= 0; i--) {

            if (inString[i] >= '0' && inString[i] <= '9') {
                decimal += parseInt(inString[i]) * Math.pow(16, position)
            } else if (inString[i] >= 'A' && inString[i] <= 'F') {
                decimal += parseString(inString[i]) * Math.pow(16, position)
            } else if (inString[i] >= 'a' && inString[i] <= 'f') {
                decimal += parseString(inString[i]) * Math.pow(16, position)
            }
            position++;
        }
        return decimal;
    }


     /**
    * convert hexdecimal value(A ~ F, a ~ f) to decimal
    */
   function parseString(indata: string): number {
        switch (indata) {
            case "A":
                return 10;
            case "B":
                return 11;
            case "C":
                return 12;
            case "D":
                return 13;
            case "E":
                return 14;
            case "F":
                return 15;
            case "a":
                return 10;
            case "b":
                return 11;
            case "c":
                return 12;
            case "d":
                return 13;
            case "e":
                return 14;
            case "f":
                return 15;

            default:
                return 0;
        }
    }

}
