import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user;

  constructor() { }

  setUser(user) {
      this.user = user;
  }

  getUser(user): Observable<any> {
    return of(this.user);
  }
}
