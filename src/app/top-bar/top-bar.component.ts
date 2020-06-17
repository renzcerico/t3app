import { HeaderModalComponent } from './../header-modal/header-modal.component';
// import { HeaderComponent } from './../header/header.component';
import { Component, OnInit, AfterContentChecked, NgModule, ViewChild, ElementRef, Renderer } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { HeaderService } from '../services/header.service';
import { CounterPipePipe } from '../counter-pipe.pipe';
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
    headerCount: Array<any> = [
        {STATUS: 1, COUNT: 0},
        {STATUS: 2, COUNT: 0},
        {STATUS: 3, COUNT: 0},
        {STATUS: 4, COUNT: 0}
    ];
    loginForm = new FormGroup({
        username: new FormControl(''),
        password: new FormControl('')
    });

    apiResponse: any;

    constructor(private modalService: NgbModal, public apis: ApiService, private headerService: HeaderService) {
        headerService.headerCount$.subscribe(
            headerCount => {
              this.headerCount = headerCount;
            }
          );
    }

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

    openHeaderModal(statusCode: number) {
        const modalRef = this.modalService.open(HeaderModalComponent);
        modalRef.componentInstance.status = statusCode;
        // modalRef.componentInstance.in_activity = this.activities[index];
    }
}
