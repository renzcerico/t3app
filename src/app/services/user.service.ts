import { ApiService } from './api.service';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user = new Subject<any>();
  user$ = this.user.asObservable();

  constructor(public api: ApiService) {
      this.isAuth();
  }

  setUser(user) {
      this.user.next(user);
  }

  getUser() {
    return this.user;
  }

  isAuth() {
    this.api.isAuth()
    .subscribe(
        res => {
          this.user.next(res);
        },
        err => {
          console.log(err);
        }
    );
  }
}
