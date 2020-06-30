import { ApiService } from './api.service';
import { Injectable } from '@angular/core';
import { Subject, timer } from 'rxjs';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class ServertimeService {
  private timeSource = new Subject<any>();
  time$ = this.timeSource.asObservable();
  constructor( private api: ApiService ) {
    this.api.getServerTime().toPromise()
    .then( res => {
        this.setTimer(res);
    });
  }

  setTimer(datetime: string) {
    let momentDate = moment(datetime);
    const timerSource = timer(1000, 1000);
    timerSource.subscribe( x => {
      momentDate = momentDate.add(1, 'second');
      this.timeSource.next(momentDate);
    });
  }
}
