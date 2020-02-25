import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
    selector: 'app-material',
    templateUrl: './material.component.html',
    styleUrls: ['./material.component.css']
})

export class MaterialComponent implements OnInit, AfterViewInit {
    @ViewChildren('tdEditable') tdEditable !: QueryList<ElementRef>;

    materials = [
        {
            id:  '1',
            material_code: '123',
            quantity: 100,
            standard: 1200,
            requirements: 'Many',
            used: 500,
            reject: 100,
            remarks: 'Remarks',
            manpower: 'R. Cerico',
            entered: '10/23/19 08:00',
            updated: null
        },
        {
            id:  '2',
            material_code: '456',
            quantity: 800,
            standard: 450,
            requirements: 'None',
            used: 45,
            reject: 16,
            remarks: 'My Remarks',
            manpower: 'R. Cerico',
            entered: '10/23/19 08:00',
            updated: null
        },
        {
            id:  '3',
            material_code: '789',
            quantity: 654,
            standard: 100,
            requirements: 'Any',
            used: 45,
            reject: 89,
            remarks: 'This is a remarks. Just testing the layout. Another testing. Final test.',
            manpower: 'R. Cerico',
            entered: '10/23/19 08:00',
            updated: null
        }
    ];

    apiResponse: any;
    constructor(public apis: ApiService) { }

    ngOnInit() {
    }

    ngAfterViewInit() {
        const editable = this.tdEditable;
        console.log(editable);
    }

    makeApiCallGET() {
        this.apis.getHeader()
        .subscribe(
            d => {
                this.apiResponse = d;
                console.log(d);
            },
            e => {
                this.apiResponse = e;
                console.log('No response ' + e);
            }
        );
    }

    // makeApiCallPOST() {
    //     this.apis.postqueryApi()
    //     .subscribe(
    //         d => {
    //             this.apiResponse = d;
    //             console.log(d);
    //         },
    //         e => {
    //             this.apiResponse = e;
    //             console.log('No response ' + e);
    //         }
    //     )
    // }

    onKeyDown(event) {
        const elArr = this.tdEditable.toArray();
        const activeIndex = elArr.findIndex( indexFilter => {
            return (indexFilter.nativeElement.parentElement === event.srcElement.parentElement);
        });

        if (activeIndex < elArr.length - 1) {
            elArr[activeIndex + 1].nativeElement.focus();
        } else {
            elArr[activeIndex].nativeElement.blur();
        }

        event.preventDefault();
    }
}
