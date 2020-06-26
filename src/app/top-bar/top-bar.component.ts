import { environment } from './../../environments/environment';
import { UserService } from './../services/user.service';
import { HeaderModalComponent } from './../header-modal/header-modal.component';
// import { HeaderComponent } from './../header/header.component';
import { Component, OnInit, AfterContentChecked, NgModule, ViewChild, ElementRef, Renderer } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { HeaderService } from '../services/header.service';
import { CounterPipePipe } from '../counter-pipe.pipe';
import { LoginComponent } from '../modals/login/login.component';

@Component({
    selector: 'app-top-bar',
    templateUrl: './top-bar.component.html',
    styleUrls: ['./top-bar.component.css']
})

export class TopBarComponent implements OnInit, AfterContentChecked {
    // @ViewChild(HeaderComponent, {static: false}) mainApp: HeaderComponent;

    navbarOpen = false;
    loginHidden = true;
    userProfile;
    btnLogin = true;
    faUser = faUser;
    username = '';
    headerCount: any;
    prevCount: any;
    updated =  [false, false, false, false];
    // loginForm = new FormGroup({
    //     username: new FormControl(''),
    //     password: new FormControl('')
    // });
    apiResponse: any;

    constructor(private modalService: NgbModal,
                public apis: ApiService,
                private headerService: HeaderService,
                public userService: UserService
    ) {
        this.headerCount = [
            {STATUS: 1, COUNT: 0},
            {STATUS: 2, COUNT: 0},
            {STATUS: 3, COUNT: 0},
            {STATUS: 4, COUNT: 0}
        ];
        headerService.headerCount$.subscribe(
            headerCount => {
                this.headerCount = headerCount;
            }
        );

        this.userLoggedIn();
    }

    ngOnInit() {
    }

    ngAfterContentChecked() {
        // this.headerService.getHeaderCountPerStatus();
    }
    userLoggedIn() {
        this.userService.user
            .subscribe(
                res => {
                    if (res) {
                        this.userProfile = res;
                        this.username = res.USERNAME;
                    }
                },
                err => {
                    console.log(err);
                }
            );
    }

    openLoginModal() {
        this.modalService.open(LoginComponent);
    }

    toggleNavbar() {
        this.navbarOpen = !this.navbarOpen;
    }

    openHeaderModal(statusCode: number, totalCount: number) {
        const modalRef = this.modalService.open(HeaderModalComponent, { size: 'xl' });
        modalRef.componentInstance.status = statusCode;
        modalRef.componentInstance.showCount = 10;
        modalRef.componentInstance.pageNumber = 1;
        modalRef.componentInstance.totalCount = totalCount;
    }

    loggedOut() {
        this.apis.logout()
            .subscribe(
                res => {
                    location.reload();
                },
                err => {
                    console.log(err);
                }
            );
    }
}
