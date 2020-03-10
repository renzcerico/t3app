import * as moment from 'moment';
export default class Activity {
    ID: number;
    HEADER_ID: number;
    START_TIME: any;
    END_TIME: any;
    LOT_NUMBER: string;
    DOWNTIME: number;
    REMARKS: string;
    LAST_UPDATED_BY: number;
    DATE_ENTERED: string;
    DATE_UPDATED: string;
    ACTIVITY_DETAILS: any[];
    IS_NEW: number;
    IS_CHANGED: number;
    get PACKED_QTY() {
        let totalPacked = 0;
        this.ACTIVITY_DETAILS.forEach(element => {
          totalPacked += element.PACKED_QTY;
        });
        return totalPacked;
    }
    get ADJ_QTY() {
        let totalAdjustment = 0;
        this.ACTIVITY_DETAILS.forEach(element => {
          totalAdjustment += element.ADJ_QTY;
        });
        return totalAdjustment;
    }
    get TOTAL() {
        return this.ADJ_QTY + this.PACKED_QTY;
    }
    constructor(jsonObj) {
        this.ID = jsonObj.ID || null;
        this.HEADER_ID = jsonObj.HEADER_ID || null;
        this.START_TIME = moment(jsonObj.START_TIME).format() || '';
        this.END_TIME = moment(jsonObj.END_TIME).format() || '';
        this.LOT_NUMBER = jsonObj.LOT_NUMBER || '';
        this.DOWNTIME = jsonObj.DOWNTIME || 0;
        this.REMARKS = jsonObj.REMARKS || '';
        this.LAST_UPDATED_BY = jsonObj.LAST_UPDATED_BY || 0;
        this.DATE_ENTERED = moment(jsonObj.DATE_ENTERED).format() || '';
        this.DATE_UPDATED = moment(jsonObj.DATE_UPDATED).format() || '';
        this.ACTIVITY_DETAILS = jsonObj.ACTIVITY_DETAILS || [];
        this.IS_NEW = jsonObj.IS_NEW || 1;
        this.IS_CHANGED = jsonObj.IS_CHANGED || 0;
    }
    getJson() {
        const json = {
            ID: this.ID,
            HEADER_ID: this.HEADER_ID,
            START_TIME: this.START_TIME,
            END_TIME: this.END_TIME,
            LOT_NUMBER: this.LOT_NUMBER,
            PACKED_QTY: this.PACKED_QTY,
            ADJ_QTY: this.ADJ_QTY,
            DOWNTIME: this.DOWNTIME,
            REMARKS: this.REMARKS,
            TOTAL: this.TOTAL,
            LAST_UPDATED_BY: this.LAST_UPDATED_BY,
            DATE_ENTERED: this.DATE_ENTERED,
            DATE_UPDATED: this.DATE_UPDATED,
            ACTIVITY_DETAILS: this.ACTIVITY_DETAILS,
            IS_NEW: this.IS_NEW,
            IS_CHANGED: this.IS_CHANGED
        };
        return json;
    }
}
