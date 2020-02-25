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
            material_code: '301144AN---XF',
            quantity: 1,
            standard: 1,
            requirements: 5000,
            used: 2550,
            reject: 0,
            remarks: 'Remarks',
            manpower: 'R. Cerico',
            entered: '10/23/19 08:00',
            updated: null
        },
        {
            id:  '2',
            material_code: 'TBA143ASCN',
            quantity: 1,
            standard: 25,
            requirements: 200,
            used: 102,
            reject: 0,
            remarks: 'My Remarks',
            manpower: 'R. Cerico',
            entered: '10/23/19 08:00',
            updated: null
        },
        {
            id:  '3',
            material_code: 'TBB143ASCN',
            quantity: 1,
            standard: 50,
            requirements: 100,
            used: 204,
            reject: 0,
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
