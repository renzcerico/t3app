import { FormBuilder, FormControl } from '@angular/forms';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from '../services/api.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css',
              '../top-bar/top-bar.component.css',
              '../material/material.component.css']
})

export class AccountsComponent implements OnInit {
  formCreateAccount;
  msg = '';
  @ViewChild('firstName', {static: false}) firstName: ElementRef;
  toggleAccount;
  // accounts;
  faEdit = faEdit;
  formTitle;
  formButtonTxt;
  acctID = 0;

  page = 1;
  pageSize = 3;
  collectionSize = 0;
  accountsArray;

  filter = new FormControl('');

  constructor(private formBuilder: FormBuilder, private api: ApiService) {
  }

  async ngOnInit() {
    this.resetFields();
    await this.displayAccounts();
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
      this.acctID > 0 ? data.id = this.acctID : data.id = 0;

      this.api.createAccount(data).toPromise()
          .then(
              res => {
                if (res.outBinds.id > 0) {
                  this.acctID === 0 ? this.resetFields() : false;
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

  editAccount(id) {
    this.toggle(false);

    this.api.getAccountById(id).toPromise()
        .then(
            res => {
              this.formCreateAccount = this.formBuilder.group({
                  firstName: res[0].FIRST_NAME,
                  middleName: res[0].MIDDLE_NAME,
                  lastName: res[0].LAST_NAME,
                  username: res[0].USERNAME,
                  userLevel: res[0].USER_LEVEL.toLowerCase(),
                  gender: res[0].GENDER.toLowerCase(),
              });
              this.acctID = id;
            },
            err => {
              console.log(err);
            }
        );
  }

  msgResponse(status) {
    if (status) {
      this.acctID === 0 ? this.msg = 'Account successfully created.' : this.msg = 'Account successfully updated.';
    } else {
      this.acctID === 0 ? this.msg = 'Failed to create account.' : this.msg = 'Failed to update account.';
    }

    setTimeout(() => {
      this.msg = '';
    }, 3000);
  }

  toggle(isExist) {
    this.toggleAccount = !this.toggleAccount;
    this.resetFields();

    if (isExist) {
      this.formAttribute(false);
    } else {
      this.formAttribute(true);
      this.acctID = 0;
    }

  }

  getAllAccounts() {
    return this.api.getAllAccounts().toPromise();
  }

  async displayAccounts() {
    // this.accounts = await this.getAllAccounts();
    // this.collectionSize = this.accounts.length;
    // this.accounts.map( (accounts, i) => ({id: i + 1 , ...accounts}) )
    // .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);

    this.accountsArray = await this.getAllAccounts();
  }

  get accounts() {
    this.collectionSize = this.accountsArray.length || 0;
    return this.accountsArray.map( (res, i) => ({id: 1 + i, ...res}) )
      .slice( (this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }

  formAttribute(isExist) {
      if (isExist) {
        this.formTitle = 'Update Account';
        this.formButtonTxt = 'Update';
      } else {
        this.formTitle = 'Create Account';
        this.formButtonTxt = 'Create';
      }

      setTimeout(() => {
        const fName = document.getElementById('firstName');
        fName.focus();
      }, 200);
  }

  resetPassword() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Reset the password to "welcome".',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((res) => {
      if (res.value) {
          const data = {
            id: this.acctID
          };

          this.api.resetPassword(data)
            .subscribe(
              res => {
                console.log(res);
                if (res === 'y') {
                  Swal.fire(
                    'Success',
                    'Password changed to "welcome".',
                    'success'
                  );
                }
              },
              err => {
                console.log(err);
              }
            );
      }
    });
  }

}
