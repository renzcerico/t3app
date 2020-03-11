import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, ViewChild, AfterContentChecked, AfterViewInit} from '@angular/core';
import { ApiService } from '../services/api.service';
import { faAngleUp, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import ScannerDetector from 'js-scanner-detection';
import * as moment from 'moment';
import { ActivityComponent } from '../activity/activity.component';
import { MaterialComponent } from './../material/material.component';
import {ActivityService} from '../activity.service';
import Activity from '../activity';

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
    headerObj = {
        ID: Number,
        BARCODE: '',
        ACTUAL_START: moment().format('DD/MMM/YY'),
        ACTUAL_END: '',
        STATUS: '',
        PO_NUMBER: '',
        CONTROL_NUMBER: '',
        SHIPPING_DATE: '',
        ORDER_QUANTITY: '',
        CUSTOMER: '',
        CUSTOMER_CODE: '',
        CUSTOMER_SPEC: '',
        OLD_CODE: '',
        INTERNAL_CODE: '',
        PRODUCT_DESCRIPTION: '',
        IS_NEW: 0,
        IS_CHANGED: 0
    };
    actCollection = [];
    matCollection = [];
    @ViewChild(ActivityComponent, {static: true}) actComponent;
    @ViewChild(MaterialComponent, {static: true}) matComponent;
    actTotal = 0;
    matArr: any;
    actArr: any = [];
    array: Array<any>;
    prodHover = 0;

    get dummyDesc() {
        return 'this is a very long description veryyyyyyyyyyyyyyyyyy long';
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

    ngOnInit() {
        this.barcode();
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
        console.log(barcodeNum);
        await this.apis.getAllByBarcode(barcodeNum)
            .subscribe(
                res => {
                this.headerObj = res.header_obj;
                this.headerObj.PRODUCT_DESCRIPTION = this.dummyDesc;
                this.activityService.setHeaderObj(this.headerObj);
                const activities = [];
                res.activity_collection.forEach(element => {
                    const activity = new Activity(element);
                    activities.push(activity);
                });
                this.activityService.setActivities(activities);
                this.matCollection = res.materials_collection;
                },
                err => {
                this.apiResponse = err;
                console.log(err);
                }
            );
    }

    handleBarcodeChange() {
        this.getData('SO35-091319-785916');
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

    handleProdMouseEnter() {
        if (this.headerObj.PRODUCT_DESCRIPTION.length >= 20 ) {
            this.prodHover = 1;
        }
    }

    handleProdMouseLeave() {
        this.prodHover = 0;
    }

}
