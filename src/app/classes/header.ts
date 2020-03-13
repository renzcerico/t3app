import { ActivityService } from './../services/activity.service';
import Activity from './activity';
import * as moment from 'moment';
export default class Header {
    ID: number;
    BARCODE: string;
    ACTUAL_START: string;
    ACTUAL_END: string;
    STATUS: string;
    PO_NUMBER: string;
    CONTROL_NUMBER: string;
    SHIPPING_DATE: string;
    ORDER_QUANTITY: number;
    CUSTOMER: string;
    CUSTOMER_CODE: string;
    CUSTOMER_SPEC: string;
    OLD_CODE: string;
    INTERNAL_CODE: string;
    PRODUCT_DESCRIPTION: string;
    SHIFT: string;
    SCHEDULE_DATE_START: string;
    SCHEDULE_DATE_END: string;
    ACTIVITIES: Array<Activity>;
    // activityService: ActivityService;

    constructor(jsonObj) {
        this.ID = jsonObj.ID || jsonObj.HEADER_ID || null;
        this.BARCODE = jsonObj.BARCODE || jsonObj.HEADER_ID || '';
        this.ACTUAL_START = jsonObj.ACTUAL_START || moment().subtract(2, 'hours');
        this.ACTUAL_END = jsonObj.ACTUAL_END || '';
        this.STATUS = jsonObj.STATUS || 'WIP';
        this.PO_NUMBER = jsonObj.PO_NUMBER || jsonObj.CUST_PO_NUMBER || '';
        this.CONTROL_NUMBER = jsonObj.CONTROL_NUMBER || '';
        this.SHIPPING_DATE = jsonObj.SHIPPING_DATE || '';
        this.ORDER_QUANTITY = jsonObj.ORDER_QUANTITY || 0;
        this.CUSTOMER = jsonObj.CUSTOMER || jsonObj.CUST_ALIAS || '';
        this.CUSTOMER_CODE = jsonObj.CUSTOMER_CODE || jsonObj.CUSTOMER_ITEM_CODE || '';
        this.CUSTOMER_SPEC = jsonObj.CUSTOMER_SPEC || jsonObj.CUSTOMER_ITEM_DESC || '';
        this.OLD_CODE = jsonObj.OLD_CODE || jsonObj.PRODUCT_CODE_OLD || '';
        this.INTERNAL_CODE = jsonObj.INTERNAL_CODE || jsonObj.PRODUCT_CODE || '';
        this.PRODUCT_DESCRIPTION = jsonObj.PRODUCT_DESCRIPTION || jsonObj.PRODUCT_DESC || '';
        this.SHIFT = jsonObj.SHIFT || 'dayshift';
        this.SCHEDULE_DATE_START = jsonObj.SCHEDULE_DATE_START || '';
        this.SCHEDULE_DATE_END = jsonObj.SCHEDULE_DATE_END || '';
    }
}
