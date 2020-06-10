import { FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css', '../top-bar/top-bar.component.css']
})
export class AccountsComponent implements OnInit {
  formCreateAccount;
  msg = '';
  displayAccounts;

  constructor(private formBuilder: FormBuilder, private api: ApiService) {
  }

  ngOnInit() {
    this.resetFields();
  }

  resetFields() {
    this.formCreateAccount = this.formBuilder.group({
        firstName: '',
        middleName: '',
        lastName: '',
        username: '',
        userLevel: 'user',
        gender: 'male',
    });
  }

  createAccount(data) {
    // const firstName = data.firstName;
    // const middleName = data.middleName;
    // const lastName = data.lastName;
    // const userLevel = data.userLevel;
    // const gender = data.genderMale ? data.genderMale : data.genderFemale;

    this.api.createAccount(data).toPromise()
      .then(
        res => {
          if (res.outBinds.id > 0) {
            this.resetFields();
            this.msgResponse(true);
          }
        },
        err => {
          if (err.status === 409) {
            this.msgResponse(false);
          }
          console.log(err);
        }
      );
  }

  msgResponse(status) {
    if (status) {
      this.msg = 'Account successfully created.';
    } else {
      this.msg = 'Failed to create account.';
    }

    setTimeout(() => {
      this.msg = '';
    }, 3000);
  }

  toggle() {
    this.displayAccounts = !this.displayAccounts;
  }

}
