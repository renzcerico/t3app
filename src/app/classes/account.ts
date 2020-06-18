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
                this.headerObj = headerObj.header_obj;
            }
        );
    }

    get USER_TYPE() {
        return this.userTypes[this.USER_LEVEL.toLowerCase()];
    }

    get IS_AUTHORIZED() {
        return false;
        // if (!this.activeUser) {
        //     return false;
        //   }
        //   switch (this.headerObj.STATUS) {
        //     case 1:
        //       if (this.activeUser) { return true; }
        //       return false;
        //       break;
        //     case 2:
        //       if (this.userType > 2 || this.activeUser.ID === this.headerObj.REVIEWED_BY) {
        //         return true;
        //       } else {
        //         return false;
        //       }
        //       break;
        //     case 3:
        //       if (this.userType > 3 || this.activeUser.ID === this.headerObj.APPROVED_BY) {
        //         return true;
        //       } else {
        //         return false;
        //       }
        //       break;
        //     case 4:
        //       return false;
        //       break;
        //   }
    }
}
