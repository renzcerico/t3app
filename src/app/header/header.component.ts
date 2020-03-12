import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, ViewChild, AfterContentChecked, AfterViewInit} from '@angular/core';
import { ApiService } from '../services/api.service';
import { faAngleUp, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import ScannerDetector from 'js-scanner-detection';
import * as moment from 'moment';
import { ActivityComponent } from '../activity/activity.component';
import { MaterialComponent } from './../material/material.component';
import {ActivityService} from '../services/activity.service';
import Activity from '../classes/activity';
import Header from '../classes/header';

@Component({
    selector: 'app-home',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit, AfterContentChecked, AfterViewInit {
    seeResult = 'See more';
    faAngleUp = faAngleUp;
    faAngleDown = faAngleDown;
    iconResult = faAngleDown;
    // headerObj = {
    //     ID: Number,
    //     BARCODE: '',
    //     ACTUAL_START: moment().format('DD/MMM/YY'),
    //     ACTUAL_END: '',
    //     STATUS: '',
    //     PO_NUMBER: '',
    //     CONTROL_NUMBER: '',
    //     SHIPPING_DATE: '',
    //     ORDER_QUANTITY: '',
    //     CUSTOMER: '',
    //     CUSTOMER_CODE: '',
    //     CUSTOMER_SPEC: '',
    //     OLD_CODE: '',
    //     INTERNAL_CODE: '',
    //     PRODUCT_DESCRIPTION: '',
    //     IS_NEW: 0,
    //     IS_CHANGED: 0
    // };
    headerObj: any = {};
    actCollection = [];
    matCollection = [];
    @ViewChild(ActivityComponent, {static: true}) actComponent;
    @ViewChild(MaterialComponent, {static: true}) matComponent;
    actTotal = 0;
    matArr: any;
    actArr: any = [];
    array: Array<any>;
    prodHover = 0;
    activities: Array<Activity>;
    getDataRes: any = {};
    get dummyDesc() {
        return 'this is a very long description veryyyyyyyyyyyyyyyyyy long';
    }

    get scheduleTime() {
        let res = '';
        if (Object.entries(this.headerObj).length > 0) {
            res = moment(this.headerObj.SCHEDULE_DATE_START).format('HHmm') + '-' + moment(this.headerObj.SCHEDULE_DATE_END).format('HHmm');
        }
        return res;
    }

    apiResponse: any;
    constructor(public apis: ApiService, private activityService: ActivityService) {
        activityService.activities$.subscribe(
            activities => {
              this.actCollection = activities;
            }
          );
    }

    ngAfterContentChecked() {
        this.actTotal = this.actComponent.subTotal;
        this.actArr = this.actComponent.activities;
        this.matArr = this.matComponent.materials;
    }

    ngAfterViewInit() {
        this.actTotal = this.actComponent.subTotal;
        this.actArr = this.actComponent.activities;
        this.matArr = this.matComponent.materials;
    }

    async ngOnInit() {
        await this.getData('SO35-091319-785915');
        // this.barcode();
    }

    btnSee() {
        this.iconResult === faAngleDown ? this.seeLess() : this.seeMore();
    }

    seeMore() {
        this.seeResult = 'See more';
        this.iconResult = faAngleDown;
        const blur = document.querySelector('#blur-container');
        blur.classList.add('blurred-bg');
    }

    seeLess() {
        this.seeResult = 'See less';
        this.iconResult = faAngleUp;
        const blur = document.querySelector('#blur-container');
        blur.classList.remove('blurred-bg');
    }

    barcode() {
        const onComplete = (val) => {
            const barcodeNum = val;
            this.getData(barcodeNum);
        };

        const options = { onComplete };

        const scannerDetector = new ScannerDetector(options);
    }

    async getData(barcodeNum) {
        await this.apis.getAllByBarcode(barcodeNum).toPromise()
        .then(
            res => {
                console.log('res: ', res);
                this.getDataRes = res;
            }
        );
        console.log('response', this.getDataRes);
        if (this.getDataRes.isExisting) {
            this.headerObj = new Header(this.getDataRes.header_obj);
            console.log(this.headerObj);
            this.activityService.setHeaderObj(this.headerObj);
            this.activityService.setActivities(this.getDataRes.activity_collection);
            this.matCollection = this.getDataRes.materials_collection;
        } else {
            alert(this.getDataRes.isExisting);
        }
    }

    handleBarcodeChange() {
        this.getData('SO35-091319-785915');
    }

    header() {
        const json = {
            header_obj          : this.headerObj,
            activity_collection : this.actCollection
        };

        this.apis.header(json)
            .subscribe(
                res => {
                    console.log(res);
                },
                err => {
                    console.log(err);
                }
                );
        console.log(json);
        return json;
    }

    handleProdMouseOver() {
        if (this.headerObj.PRODUCT_DESCRIPTION.length >= 65 ) {
            this.prodHover = 1;
        }
    }
}
