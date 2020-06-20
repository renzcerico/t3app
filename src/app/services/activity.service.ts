import { ActivityFactory } from './../classes/activity-factory';
import { HeaderService } from './header.service';
import { Injectable} from '@angular/core';
import { Observable, throwError } from 'rxjs';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import Activity from '../classes/activity.js';
import { ApiService } from './api.service';
import Header from '../classes/header';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private activitiesSource = new Subject<Array<Activity>>();
  private headerSource = new Subject<object>();
  private actualTimeSource = new Subject<object>();
  private downtimeTypeSource = new Subject<Array<object>>();
  activities$ = this.activitiesSource.asObservable();
  header$ = this.headerSource.asObservable();
  actualTime$ = this.actualTimeSource.asObservable();
  downtimeTypes$ = this.downtimeTypeSource.asObservable();
  activities: Array<Activity>;
  shifts: Array<any> = [];
  headerObj: any = {};
  downtimeTypes: any = [];

  constructor(private apiService: ApiService, private headerService: HeaderService, private activityFactory: ActivityFactory) {
    const dayshift = 'dayshift';
    const nightshift = 'nightshift';
    const date = new Date();
    const dateString = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
    this.shifts[dayshift] = {
      first_hour: moment( dateString + ' 08:00', 'MM/DD/YYYY HH:mm'),
      breaktime_start: moment( dateString + ' 12:00', 'MM/DD/YYYY HH:mm'),
      breaktime_end: moment( dateString + ' 13:00', 'MM/DD/YYYY HH:mm')
    };

    this.shifts[nightshift] = {
      first_hour: moment(dateString + ' 19:00', 'MM/DD/YYYY HH:mm'),
      breaktime_start: moment(dateString + ' 00:00', 'MM/DD/YYYY HH:mm'),
      breaktime_end: moment(dateString + ' 01:00', 'MM/DD/YYYY HH:mm')
    };
    this.activities$.subscribe(
      activities => {
        this.activities = activities;
      }
    );
    headerService.header$.subscribe(
      data => {
        this.headerObj = new Header(data.header_obj);
      }
    );
    this.startTimer();
    this.getDowntimeTypes();
  }

  get expectedTime() {
    let res = { start: null, end: null };
    let start;
    let end;
    if (Object.entries(this.headerObj).length > 0) {
      start = moment(this.headerObj.ACTUAL_START);
      if (
          (
            this.headerObj.SHIFT === 'dayshift' &&
            start.isBefore(this.shifts[this.headerObj.SHIFT].first_hour)
          ) ||
          (
            this.headerObj.SHIFT === 'nightshift' &&
            moment(start).format('A') === 'PM' &&
            start.isBefore(this.shifts[this.headerObj.SHIFT].first_hour )
          )
        ) {
        start = this.shifts[this.headerObj.SHIFT].first_hour;
      }
      if (this.activities.length > 0) {
        start = moment(this.lastActivity.END_TIME);
      }
    }
    end = moment(start).add(1, 'hours').startOf('hour');
    res = {start, end};
    return res;
  }

  get actualTime() {
    let res = {start: null, end: null, exact: null};
    let start = moment()/* .subtract(1, 'hours') */.startOf('hour');
    if (Object.entries(this.headerObj).length > 0) {
      if (start.isSame(this.shifts[this.headerObj.SHIFT].breaktime_start)) {
        start = this.shifts[this.headerObj.SHIFT].breaktime_end;
      }
    }
    const end = moment(start).add(1, 'hours');
    const exact = moment();
    res = {start, end, exact};
    this.setActualTime(res);
    return res;
  }

  get lastActivity() {
    let res;
    if (this.activities.length) {
      res = this.activities[0];
    }
    return res;
  }

  getShiftData(shift) {
    return this.shifts[shift];
  }

  setActualTime(actualTime) {
    this.actualTimeSource.next(actualTime);
  }

  setActivities(activities: Array<any>) {
    const activitiesArr = [];
    activities.forEach(element => {
        const activity = this.activityFactory.createActivity(element);
        activitiesArr.push(activity);
    });
    // console.log(activitiesArr[0]);
    this.activitiesSource.next(activitiesArr);
  }

  addActivity(activity: any) {
    if (!this.headerObj.BARCODE) {
      alert('Scan First!');
      return;
    }
    activity.START_TIME = this.actualTime.start;
    activity.END_TIME = this.actualTime.end;
    if (this.actualTime.start.isAfter(this.expectedTime.start)) {
      this.setFillers();
    } else if (this.actualTime.start.isBefore(this.expectedTime.start)) {
      if (this.activities.length > 0) {
        if (confirm('End prod?')) {
          this.headerObj.STATUS = 'open';
          this.headerObj.ACTUAL_END = new Date();
          activity.START_TIME = moment(this.actualTime.exact).startOf('hour');
          activity.END_TIME = this.actualTime.exact;
        } else {
          return;
        }
      } else {
        if (this.actualTime.start.isBefore(this.shifts[this.headerObj.SHIFT].first_hour)) {
          activity.START_TIME = this.shifts[this.headerObj.SHIFT].first_hour;
          activity.END_TIME = moment(activity.START_TIME).add(1, 'hours');
        }
      }
    } else {
      alert('just right hehez');
      // return;
      // return;
    }
    const newAct = this.activityFactory.createActivity(activity);
    this.activities.unshift(newAct);
    this.logTime();
  }

  logTime() {
    const diff = this.actualTime.start.diff(this.expectedTime.start, 'hours');
  }

  setFillers() {
    const diff = this.actualTime.start.diff(this.expectedTime.start, 'hours');
    let filler;
    for (let index = 0; index < diff; index++) {
      this.logTime();
      filler = this.activityFactory.createActivity({
        HEADER_ID       : this.headerObj.ID,
        START_TIME      : this.expectedTime.start,
        END_TIME        : this.expectedTime.end,
        LAST_UPDATED_BY : 1,
        DATE_ENTERED    : moment().format('DD/MMM/YY'),
        DATE_UPDATED    : moment().format('DD/MMM/YY'),
        IS_NEW          : 1,
        IS_CHANGED      : 0
      });
      this.activities.unshift(filler);
    }
  }

  startTimer() {
    setInterval(() => {
      if (Object.entries(this.headerObj).length > 0) {
        if (this.headerObj.STATUS === 1) {
          this.setFillers();
        }
      }
    }, 1000);
  }

  async getDowntimeTypes() {
    await this.apiService.getDowntimeTypes().toPromise()
    .then(
        res => {
          res.forEach(element => {
            element.DISABLED = false;
          });
          this.downtimeTypeSource.next(res);
        }
    );
  }

}
