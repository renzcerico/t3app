import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { faAngleUp, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import ScannerDetector from 'js-scanner-detection';
import * as moment from 'moment';

@Component({
    selector: 'app-home',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {
    seeResult = 'See more';
    faAngleUp = faAngleUp;
    faAngleDown = faAngleDown;
    iconResult = faAngleDown;
    barcodeNumber = '';
    startTime = '';

    materials = [
        {
            id:  '1',
            material_code: '123',
            quantity: '100',
            standard: '1200',
            requirements: 'Many',
            used: '500',
            reject: '100',
            remarks: 'Remarks'
        },
        {
            id:  '2',
            material_code: '456',
            quantity: '800',
            standard: '450',
            requirements: 'None',
            used: '45',
            reject: '16',
            remarks: 'My Remarks'
        },
        {
            id:  '3',
            material_code: '789',
            quantity: '654',
            standard: '100',
            requirements: 'Any',
            used: '45',
            reject: '89',
            remarks: 'Another Remarks'
        }
    ];

    apiResponse: any;
    constructor(public apis: ApiService) { }

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
        };

        const options = { onComplete };

        const scannerDetector = new ScannerDetector(options);
    }

}
