import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
    selector: 'app-material',
    templateUrl: './material.component.html',
    styleUrls: ['./material.component.css']
})

export class MaterialComponent implements OnInit {
    materials = [
        {
            id:  '1',
            material_code: '123',
            quantity: '100',
            standard: '1200',
            requirements: 'Many',
            used: '500',
            reject: '100',
            remarks: 'Remarks',
            manpower: 'R. Cerico',
            entered: '10/23/19 08:00',
            updated: null
        },
        {
            id:  '2',
            material_code: '456',
            quantity: '800',
            standard: '450',
            requirements: 'None',
            used: '45',
            reject: '16',
            remarks: 'My Remarks',
            manpower: 'R. Cerico',
            entered: '10/23/19 08:00',
            updated: null
        },
        {
            id:  '3',
            material_code: '789',
            quantity: '654',
            standard: '100',
            requirements: 'Any',
            used: '45',
            reject: '89',
            remarks: 'This is a remarks. Just testing the layout. Another testing. Final test.',
            manpower: 'R. Cerico',
            entered: '10/23/19 08:00',
            updated: null
        }
    ];

    apiResponse: any;
    constructor(public apis: ApiService) { }

    ngOnInit() { }

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

    loginModal() {
        // this.modalService.open(template);
    }

    consume() {
        fetch('http://localhost:3000/api/header', {
            method: 'GET',
            headers: { 'Content-type' : 'application/json' }
        })
        .then(res => res.json())
        .then(res => {
            console.log(res);
        })
        .catch(err => {
            console.log(err);
        });

        this.materials.push(        {
            id:  '4',
            material_code: '789',
            quantity: '654',
            standard: '100',
            requirements: 'Any',
            used: '45',
            reject: '89',
            remarks: 'This is a remarks.',
            manpower: 'R. Cerico',
            entered: '10/23/19 08:00',
            updated: null
        });
    }
}
