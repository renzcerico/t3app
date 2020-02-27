import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, ViewChild, AfterContentChecked, AfterViewInit} from '@angular/core';
import { ApiService } from '../services/api.service';
import { faAngleUp, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import ScannerDetector from 'js-scanner-detection';
import * as moment from 'moment';
import { ActivityComponent } from '../activity/activity.component';
import { MaterialComponent } from './../material/material.component';

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
    barcodeNumber: any;
    startTime: any;
    endTime: any;
    status: any;
    poNumber: any;
    controlNumber: any;
    shippingDate: any;
    orderQuantity: any;
    customer: any;
    customerCode: any;
    customerSpecs: any;
    oldCode: any;
    internalCode: any;
    productDesc: any;
    @ViewChild(ActivityComponent, {static: true}) actComponent;
    @ViewChild(MaterialComponent, {static: true}) matComponent;
    actTotal = 0;
    matArr: any;
    actArr: any;

    apiResponse: any;
    constructor(public apis: ApiService) { }

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
            this.barcodeNumber = val;
            this.startTime = moment().format('MM/DD/Y HH:mm');
            this.getData();
        };

        const options = { onComplete };

        const scannerDetector = new ScannerDetector(options);
    }

    getData() {
        this.apis.getData(this.barcodeNumber)
            .subscribe(
              res => {
                const jsonRes = res[0];
                (
                    jsonRes.ACTUAL_START !== null ?
                    this.startTime = moment(jsonRes.ACTUAL_START, 'DD-MMM-YYYY HH:mm').format('MM/DD/Y HH:mm') :
                    this.startTime = ''
                );
                (
                    jsonRes.ACTUAL_END !== null ?
                    this.endTime = moment(jsonRes.ACTUAL_END, 'DD-MMM-YYYY HH:mm').format('MM/DD/Y HH:mm') :
                    this.endTime =  ''
                );
                (
                    jsonRes.MNFG_DATE !== null ?
                    this.shippingDate = moment(jsonRes.MNFG_DATE, 'DD-MMM-YYYY HH:mm').format('MM/DD/Y HH:mm') :
                    this.shippingDate =  ''
                );
                this.status = jsonRes.STATUS;
                this.poNumber = jsonRes.HEADER_ID;
                this.controlNumber = jsonRes.BATCH_NO;
                this.orderQuantity = jsonRes.STD_OUTPUT;
                this.customer = jsonRes.LINE_LEADER;
                this.customerCode = jsonRes.BATCH_ID;
                this.customerSpecs = jsonRes.PRODUCTION_NO;
                this.oldCode = jsonRes.LOT_NUMBER;
                this.internalCode = jsonRes.PRODUCT_CODE;
                this.productDesc = jsonRes.PRODUCT_DESC;
              },
              err => {
                this.apiResponse = err;
                console.log(err);
              }
            );
    }

    handleBarcodeChange() {
        this.getData();
    }

    header() {
        const json = {
            start_time: this.startTime,
            end_time: this.endTime,
            shipping_date: this.shippingDate,
            status: this.status,
            po_number: this.poNumber,
            control_number: this.controlNumber,
            order_qty: this.orderQuantity,
            customer: this.customer,
            customer_code: this.customerCode,
            customer_specs: this.customerSpecs,
            old_code: this.oldCode,
            internal_code: this.internalCode,
            product_desc: this.productDesc
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

        console.log(this.matArr);
        console.log(this.actArr);
        // console.log(json);
        // return json;
    }

}
