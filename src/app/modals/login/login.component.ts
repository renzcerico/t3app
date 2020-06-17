import { UserService } from './../../services/user.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from './../../services/api.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css', './../../top-bar/top-bar.component.css']
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
      username: new FormControl(''),
      password: new FormControl('')
  });
  username = '';
  apiResponse: any;
  loginHidden = true;

  constructor(public apis: ApiService,
             private modalService: NgbModal,
             public activeModal: NgbActiveModal,
             public userService: UserService) { }

  ngOnInit() {
  }

  login() {
    const loginForm = this.loginForm;
    const barcode = document.getElementById('barcode');

    this.apis.loginAPI(loginForm.value)
    .subscribe(
        result => {
            this.apiResponse = result;
            console.log(this.apiResponse);

            if (this.apiResponse) {
                this.username = this.apiResponse.USERNAME;
                this.userService.setUser(this.apiResponse);

                this.modalService.dismissAll();
                setTimeout(() => {
                  barcode.focus();
                }, 100);
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
