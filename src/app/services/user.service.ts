import { HeaderService } from './header.service';
import { ApiService } from './api.service';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Subject } from 'rxjs';
import Account from '../classes/account';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  user = new Subject<any>();
  user$ = this.user.asObservable();

  constructor(public api: ApiService, private headerService: HeaderService) {
      this.isAuth();
  }

  setUser(user) {
      if (user) {
        const userObj = new Account(user, this.headerService);
        this.user.next(userObj);
      } else {
        this.user.next(user);
      }
  }
  // create account claaaaaassssssssssssssssssssssssssssssssssssssssssssss
  getUser() {
    return this.user;
  }

  isAuth() {
    this.api.isAuth()
    .subscribe(
        res => {
          this.setUser(res);
        },
        err => {
          console.log(err);
        }
    );
  }
}
