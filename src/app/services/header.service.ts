import { Injectable } from '@angular/core';
import Header from '../classes/header';
import { Observable, throwError } from 'rxjs';
import * as moment from 'moment';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  private headerSource = new Subject<Header>();
  header$ = this.headerSource.asObservable();
  header: Header;
  constructor() { }

  setHeaderObj(headerObj) {
    const header = new Header(headerObj);
    this.headerSource.next(header);
  }
}
