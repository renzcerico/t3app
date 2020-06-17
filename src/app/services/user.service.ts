import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user = new Subject<any>();
  user$ = this.user.asObservable();

  constructor() { }

  setUser(user) {
      this.user.next(user);
  }

  getUser() {
    return this.user;
  }
}
