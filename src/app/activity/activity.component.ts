import {
  Component,
  ElementRef,
  QueryList,
  ViewChildren,
  Input,
  OnInit,
  AfterContentChecked
} from '@angular/core';
import * as moment from 'moment';
import {ActivityService} from '../services/activity.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivityDetailsComponent } from '../activity-details/activity-details.component';
import { ActivityDowntimeComponent } from '../activity-downtime/activity-downtime.component';
import { UserService } from './../services/user.service';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css', '../material/material.component.css', '../app.component.css']
})
export class ActivityComponent implements OnInit, AfterContentChecked {

  @ViewChildren('contentTr') contentTr !: QueryList<ElementRef>;
  @ViewChildren('editableTd') editableTd !: QueryList<ElementRef>;
  @ViewChildren('headerInput') headerInput !: QueryList<ElementRef>;
  mLotNumber: string;
  mPacked = 0;
  mAdjustment = 0;
  actualTime: any = {};
  activities: any = [];
  downtimeTypes: any = [];
  selectedActivityIndex = 7;
  activeUser;
  userID;
  userType: number;
  isAuthorized: boolean;
  get subTotal() {
    let subTotal = 0;
    if (this.activities.length) {
      this.activities.forEach( (el) => {
        subTotal += el.TOTAL_BOXES;
      });
    }
    return subTotal;
  }

  get downtimeSubTotal() {
    let subTotal = 0;
    if (this.activities.length) {
      this.activities.forEach( (el) => {
        subTotal += el.TOTAL_DOWNTIME;
      });
    }
    return subTotal;
  }

  constructor(
      private activityService: ActivityService,
      private modalService: NgbModal,
      private userService: UserService) {
    activityService.activities$.subscribe(
      activities => {
        this.activities = activities;
        console.log(activities)
      }
    );
    activityService.downtimeTypes$.subscribe(
      downtimeTypes => {
        this.downtimeTypes = downtimeTypes;
      }
    );
    activityService.actualTime$.subscribe(
      actualTime => {
        this.actualTime = actualTime;
      }
    );
  }

  ngAfterContentChecked() {
    (this.activeUser ? this.isAuthorized = this.activeUser.IS_AUTHORIZED : this.isAuthorized = false);
  }

  ngOnInit() {
    this.userService.user.subscribe(
      res => {
        if (res) {
          this.activeUser = res;
        }
      },
        err => {
        console.log(err);
      }
    );
  }

  handleKeyDown(event) {
    event.preventDefault();
  }

  handleTrKeyUp(event) {
    const elArr = this.editableTd.toArray();

    const active = elArr.findIndex(index => {
      return (index.nativeElement.parentElement === event.target.parentElement);
    });

    if (event.target.attributes.required && !event.target.value) {
      return;
    }

    if (active < elArr.length - 1) {
      elArr[active + 1].nativeElement.focus();
    } else {
      event.target.blur();
    }
  }

  valueChanged(index) {
    this.activities[index].IS_CHANGED = 1;
    // this.activities[index].LAST_UPDATED_BY = this.activeUser.ID;
  }

  openModal(event, index) {
    const modalRef = this.modalService.open(ActivityDetailsComponent,
      {
        size: 'lg',
        beforeDismiss: () => {
          if (this.isAuthorized) {
            if (modalRef.componentInstance.isChanged
              || modalRef.componentInstance.mLotNumber !== ''
              || modalRef.componentInstance.mPacked !== 0) {
            return confirm('You will lose your unsaved changes');
            }
          }
          console.log(this.activities[index].LAST_UPDATED_BY);
        }
      });
    modalRef.componentInstance.selectedActivityIndex = index;
    modalRef.componentInstance.in_activity = this.activities[index];
    modalRef.componentInstance._isAuthorized = this.isAuthorized;
    modalRef.componentInstance.userType = this.activeUser.USER_TYPE;
  }

  openDowntimeModal(event, index) {
    const modalRef = this.modalService.open(ActivityDowntimeComponent,
      {
        size: 'lg',
        beforeDismiss: () => {
          if (this.isAuthorized) {
            if (modalRef.componentInstance.isChanged
              || modalRef.componentInstance.mMinutes !== 0
              || modalRef.componentInstance.mQuantity !== 0
              || modalRef.componentInstance.mRemarks !== '') {
              return confirm('You will lose your unsaved changes');
            }
          }
        }
      });
    modalRef.componentInstance.activity = this.activities[index];
    modalRef.componentInstance.downtimeTypes = this.downtimeTypes;
    modalRef.componentInstance.isAuthorized = this.isAuthorized;
    modalRef.componentInstance.userID = this.activeUser.ID;
    event.stopPropagation();
  }

}
