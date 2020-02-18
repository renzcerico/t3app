// import { HeaderComponent } from './../header/header.component';
import { Component, OnInit, NgModule, ViewChild, ElementRef, Renderer } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { faUser } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-top-bar',
    templateUrl: './top-bar.component.html',
    styleUrls: ['./top-bar.component.css']
})

export class TopBarComponent implements OnInit {
    // @ViewChild(HeaderComponent, {static: false}) mainApp: HeaderComponent;

    navbarOpen = false;
    loginHidden = true;
    userProfile = false;
    btnLogin = true;
    faUser = faUser;
    username = '';

    loginForm = new FormGroup({
        username: new FormControl(''),
        password: new FormControl('')
    });

    apiResponse: any;

    constructor(private modalService: NgbModal, public apis: ApiService) {}

    ngOnInit() {
    }

    openLoginModal(loginModal: any) {
        this.modalService.open(loginModal);
    }

    toggleNavbar() {
        this.navbarOpen = !this.navbarOpen;
    }

    login() {
        const loginForm = this.loginForm;
        const barcode = document.getElementById('barcode');

        this.apis.loginAPI(loginForm.value)
        .subscribe(
            result => {
                this.apiResponse = result;

                if (result.bv !== 'N') {
                    result = result.bv.toString();
                    result = result.split('|');
                    this.btnLogin = false;
                    this.username = result[1];
                    this.userProfile = true;
                    this.modalService.dismissAll();
                    barcode.focus();
                } else {
                    this.loginHidden = false;
                    setTimeout(() => {
                        this.loginHidden = true;
                    }, 3000);
                }
            },
            error => {
                this.apiResponse = error;
                console.log('No response ' + error);
            }
        );
    }
}
