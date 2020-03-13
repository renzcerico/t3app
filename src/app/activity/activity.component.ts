import {
  Component,
  ElementRef,
  QueryList,
  ViewChildren,
  Input
} from '@angular/core';
import * as moment from 'moment';
import {ActivityService} from '../services/activity.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivityDetailsComponent } from '../activity-details/activity-details.component';
import { ActivityDowntimeComponent } from '../activity-downtime/activity-downtime.component';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css', '../material/material.component.css']
})
export class ActivityComponent {

  @ViewChildren('contentTr') contentTr !: QueryList<ElementRef>;
  @ViewChildren('editableTd') editableTd !: QueryList<ElementRef>;
  @ViewChildren('headerInput') headerInput !: QueryList<ElementRef>;

  // actLotNumber: string;
  // actPackedQty: any;
  // actDowntime: any;
  // actRemarks: any;
  mLotNumber: string;
  mPacked = 0;
  mAdjustment = 0;
  actualTime: any = {};
  activities: any = [];
  downtimeTypes: any = [];
  selectedActivityIndex = 7;
  @Input() headerObj: any = {};

  get subTotal() {
    let subTotal = 0;
    if (this.activities.length) {
      this.activities.forEach( (el) => {
        subTotal += el.TOTAL_BOXES;
      });
    }
    return subTotal;
  }

  constructor(private activityService: ActivityService, private modalService: NgbModal) {
    activityService.activities$.subscribe(
      activities => {
        this.activities = activities;
      }
    );
    activityService.downtimeTypes$.subscribe(
      downtimeTypes => {
        this.downtimeTypes = downtimeTypes;
      }
    );
    activityService.header$.subscribe(
      headerObj => {
        this.headerObj = headerObj;
      }
    );
    activityService.actualTime$.subscribe(
      actualTime => {
        this.actualTime = actualTime;
      }
    );
  }

  // handleKeyUp(event) {
  //   const elArr = this.headerInput.toArray();

  //   const active = elArr.findIndex(index => {
  //     return (index.nativeElement.parentElement === event.target.parentElement);
  //   });

  //   if (event.target.attributes.required && !event.target.value) {
  //     return;
  //   }

  //   if (active < elArr.length - 1) {
  //     elArr[active + 1].nativeElement.focus();
  //   } else {

  //     const newActivity = {
  //       PACKED_QTY      : this.actPackedQty,
  //       ADJ_QTY         : 0,
  //       DOWNTIME        : this.actDowntime,
  //       REMARKS         : this.actRemarks,
  //       LAST_UPDATED_BY : 1,
  //       DATE_ENTERED    : moment().format('DD/MMM/YY'),
  //       DATE_UPDATED    : moment().format('DD/MMM/YY'),
  //       IS_NEW          : 1,
  //       IS_CHANGED      : 0
  //     };
  //     this.addActivity(newActivity);
  //     this.clearInputs();
  //   }

  // }

  handleKeyDown(event) {
    event.preventDefault();
  }

  // addActivity(newActivity) {
  //   this.activityService.addActivity(newActivity);
  // }

  // clearInputs() {
  //   this.actDowntime = '';
  //   this.actPackedQty = '';
  //   this.actRemarks = '';
  //   this.actLotNumber = '';
  //   this.headerInput.toArray()[0].nativeElement.focus();
  // }

  handleTrKeyUp(event) {
    // console.log(event);
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
  }

  openModal(event, index) {
    const modalRef = this.modalService.open(ActivityDetailsComponent,
      {
        size: 'lg',
      });
    modalRef.componentInstance.selectedActivityIndex = index;
    modalRef.componentInstance.in_activity = this.activities[index];
  }

  openDowntimeModal(event, index) {
    const modalRef = this.modalService.open(ActivityDowntimeComponent,
      {
        size: 'lg',
      });
    modalRef.componentInstance.selectedActivityIndex = index;
    modalRef.componentInstance.activities = this.activities;
    modalRef.componentInstance.downtimeTypes = this.downtimeTypes;
    event.stopPropagation();
  }

}
