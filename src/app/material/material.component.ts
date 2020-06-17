import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef, QueryList, Input, Output, EventEmitter } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
    selector: 'app-material',
    templateUrl: './material.component.html',
    styleUrls: ['./material.component.css']
})

export class MaterialComponent implements OnInit {
    @ViewChildren('tdEditable') tdEditable !: QueryList<ElementRef>;
    @Input() actTotal: number;
    @Input() materials = [];


    apiResponse: any;
    constructor(public apis: ApiService) { }

    ngOnInit() {
    }

    valueChanged(index) {
        this.materials[index].IS_CHANGED = 1;
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
