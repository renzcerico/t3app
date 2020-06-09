import { MaterialService } from './../services/material.service';
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
import { HeaderService } from '../services/header.service';

@Component({
    selector: 'app-home',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css', '../app.component.css']
})

export class HeaderComponent implements OnInit, AfterContentChecked, AfterViewInit {
    seeResult = 'See more';
    faAngleUp = faAngleUp;
    faAngleDown = faAngleDown;
    iconResult = faAngleDown;
    currentStatus = '';
    currentStatusDesc = '';
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
    constructor(
        public apis: ApiService,
        private activityService: ActivityService,
        private materialService: MaterialService,
        private headerService: HeaderService) {
        activityService.activities$.subscribe(
            activities => {
              this.actCollection = activities;
            }
          );
        materialService.materials$.subscribe(
            materials => {
                this.matCollection = materials;
            }
        );
        headerService.header$.subscribe(
            header => {
                this.headerObj = header;
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
        await this.getData('163178');
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

    visibleStatus(status) {
        if (status === 'WIP' || status === 1) {
            this.currentStatus = 'dot status-wip';
            this.currentStatusDesc = 'WIP';
        } else if (status === 'OPEN' || status === 2) {
            this.currentStatus = 'dot status-open';
            this.currentStatusDesc = 'OPEN';
        } else if (status === 'COMPLETED' || status === 3) {
            this.currentStatus = 'dot status-completed';
            this.currentStatusDesc = 'COMPLETED';
        } else if (status === 'CLOSED' || status === 4) {
            this.currentStatus = 'dot status-closed';
            this.currentStatusDesc = 'CLOSED';
        }
    }

    async getData(barcodeNum) {
        await this.apis.getAllByBarcode(barcodeNum).toPromise()
        .then(
            res => {
                this.getDataRes = res;
            }
        );

        if (this.getDataRes.isExisting) {
            this.headerService.setHeaderObj(this.getDataRes.header_obj);
            this.activityService.setActivities(this.getDataRes.activity_collection);
            this.materialService.setMaterials(this.getDataRes.materials_collection);

            const barcodeStatus = this.getDataRes.header_obj.STATUS;
            this.visibleStatus(barcodeStatus);
        } else {
            await this.apis.getNewBatch().toPromise()
            .then(
                res => {
                    this.materialService.setMaterials(res.material_collection);
                    this.headerService.setHeaderObj(res.batch_collection[0]);
                    this.activityService.setActivities([]);
                    // this.getDataRes = res;
                }
            );
        }
        // console.log(this.headerObj);
    }

    handleBarcodeChange() {
        this.getData('SO35-091319-785915');
    }

    header() {
        // tslint:disable-next-line: variable-name
        const activity_collection = [];
        this.actCollection.forEach(el => {
            activity_collection.push(el.getJson());
        });
        const json = {
            header_obj          : this.headerObj,
            material_collection : this.matCollection,
            activity_collection
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
        this.getData(json.header_obj.BARCODE);
    }

    handleProdMouseOver() {
        if (Object.entries(this.headerObj).length > 0) {
            if (this.headerObj.PRODUCT_DESCRIPTION.length >= 60 ) {
                this.prodHover = 1;
            }
        }
    }

    endProduction() {
        if (confirm('Confirm end production?')) {
            // user types
            // 1 : manpower
            // 2 : supervisor
            // 3 : manager

            // status
            // 1 : wip
            // 2 : open
            // 3 : completed
            // 4 : closed
            const userID = 1;
            const date = new Date();
            const userType: number = 2;
            if (userType === 1) {
                this.headerObj.IS_CHANGED = 1;
                this.headerObj.STATUS = 2;
                this.headerObj.ACTUAL_END = moment(date).format('DD-MMM-YYYY HH:mm:ss');
                this.headerObj.REVIEWED_BY = userID;
                this.headerObj.FORWARDED_BY = userID;
            } else if (userType === 2) {
                this.headerObj.IS_CHANGED = 1;
                this.headerObj.STATUS = 3;
                this.headerObj.ACTUAL_END = moment(date).format('DD-MMM-YYYY HH:mm:ss');
                this.headerObj.REVIEWED_AT = moment(date).format('DD-MMM-YYYY HH:mm:ss');
                this.headerObj.FORWARDED_BY = userID;
                this.headerObj.REVIEWED_BY = userID;
            } else if (userType === 3) {
                this.headerObj.IS_CHANGED = 1;
                this.headerObj.STATUS = 3;
                this.headerObj.ACTUAL_END = moment(date).format('DD-MMM-YYYY HH:mm:ss');
                this.headerObj.FORWARDED_BY = userID;
                this.headerObj.REVIEWED_AT = moment(date).format('DD-MMM-YYYY HH:mm:ss');
                this.headerObj.REVIEWED_BY = userID;
                this.headerObj.APPROVED_AT = moment(date).format('DD-MMM-YYYY HH:mm:ss');
                this.headerObj.APPROVED_BY = userID;
            }
            this.header();
        }
    }
}
