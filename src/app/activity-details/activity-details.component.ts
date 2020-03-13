import { ActivityFactory } from './../classes/activity-factory';
import {
  Component,
  ElementRef,
  ViewChildren,
  QueryList,
  OnInit
} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-activity-details',
  templateUrl: './activity-details.component.html',
  styleUrls: ['./activity-details.component.css']
})
export class ActivityDetailsComponent implements OnInit {

  // tslint:disable-next-line: variable-name
  in_activity: any = [];
  mLotNumber: string;
  mPacked = 0;
  selectedActivityIndex: number;
  activity: any = {};
  @ViewChildren('modalHeaderInput') modalHeaderInput !: QueryList<ElementRef>;

  constructor(public activeModal: NgbActiveModal, private activityFactory: ActivityFactory) {
  }

  ngOnInit() {
    this.activity = this.in_activity;
  }

  modalEnter(event) {
    const elArr = this.modalHeaderInput.toArray();
    const active = elArr.findIndex(index => {
      return (index.nativeElement.parentElement === event.target.parentElement);
    });

    if (event.target.attributes.required && !event.target.value) {
      return;
    }

    if (active < elArr.length - 1) {
      elArr[active + 1].nativeElement.focus();
    } else {
      elArr.forEach((el, index) => {
        // TO DO catch if prev input is null
      });
      const newActivityDetail = {
        LOT_NUMBER      : this.mLotNumber,
        PACKED_QTY      : this.mPacked,
        ADJ_QTY         : 0,
        IS_NEW          : 1,
        IS_CHANGED      : 0
      };
      this.activity.ACTIVITY_DETAILS.unshift(newActivityDetail);
      this.mPacked = 0;
      this.mLotNumber = '';
      elArr[0].nativeElement.focus();
    }

  }

  setIsChanged(index: number) {
    this.activity.IS_CHANGED = 1;
    this.activity.ACTIVITY_DETAILS[index].IS_CHANGED = 1;
  }

}
