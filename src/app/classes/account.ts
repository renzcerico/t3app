import { HeaderService } from './../services/header.service';
import Header from './header';
export default class Account {
    ID: number;
    FIRST_NAME: string;
    MIDDLE_NAME: string;
    LAST_NAME: string;
    GENDER: string;
    USER_LEVEL: string;
    CREATED_AT: string;
    USERNAME: string;
    headerObj: Header;
    userTypes = {
        manpower    : 1,
        supervisor  : 2,
        manager     : 3,
        admin       : 4
    };
    constructor(jsonObj, private headerService: HeaderService) {
        this.ID          = jsonObj.ID || null;
        this.FIRST_NAME  = jsonObj.FIRST_NAME || '';
        this.MIDDLE_NAME = jsonObj.MIDDLE_NAME || '';
        this.LAST_NAME   = jsonObj.LAST_NAME || '';
        this.GENDER      = jsonObj.GENDER || '';
        this.USER_LEVEL  = jsonObj.USER_LEVEL || '';
        this.CREATED_AT  = jsonObj.CREATED_AT || '';
        this.USERNAME    = jsonObj.USERNAME || '';
        headerService.header$.subscribe(
            headerObj => {
                this.headerObj = new Header(headerObj.header_obj);
            }
        );
    }

    get USER_TYPE() {
        return this.userTypes[this.USER_LEVEL.toLowerCase()];
    }

    get IS_AUTHORIZED() {
        console.log('header: ', this.headerObj);
        if (this.headerObj) {
            if (this.headerObj.STATUS > this.USER_TYPE) {
                return false;
            } else if (this.headerObj.STATUS < this.USER_TYPE) {
                return true;
            } else {
                switch (this.headerObj.STATUS) {
                    case 1:
                        return true;
                        break;
                    case 2:
                        if (this.headerObj.REVIEWED_BY === this.ID) {
                            return true;
                        }
                        return false;
                        break;
                    case 3:
                        if (this.headerObj.APPROVED_BY === this.ID) {
                            return true;
                        }
                        return false;
                        break;
                    default:
                        return false;
                        break;
                }
            }
            // return false;
        }
        return false;
    }
}
