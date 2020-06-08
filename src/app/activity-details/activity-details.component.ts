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
  tempActDetails: Array<any> = [];
  activity: any = {};
  @ViewChildren('modalHeaderInput') modalHeaderInput !: QueryList<ElementRef>;

  constructor(public activeModal: NgbActiveModal, private activityFactory: ActivityFactory) {
  }

  ngOnInit() {
    this.in_activity.ACTIVITY_DETAILS.forEach(el => {
      const actDetail = {};
      Object.assign(actDetail, el);
      this.tempActDetails.push(actDetail);
    });
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
      this.tempActDetails.push(newActivityDetail);
      this.mPacked = 0;
      this.mLotNumber = '';
      elArr[0].nativeElement.focus();
    }

  }

  setIsChanged(index: number) {
    this.tempActDetails[index].IS_CHANGED = 1;
  }

  get packedQty() {
    let res = 0;
    this.tempActDetails.forEach(el => {
      res += el.PACKED_QTY;
    });
    return res;
  }

  get adjQty() {
    let res = 0;
    this.tempActDetails.forEach(el => {
      res += el.ADJ_QTY;
    });
    return res;
  }

  get total() {
    return this.packedQty + this.adjQty;
  }

  handleSave() {
    this.in_activity.ACTIVITY_DETAILS = this.tempActDetails;
    console.log('in_activity.ACTIVITY_DETAILS: ', this.in_activity.ACTIVITY_DETAILS);
    console.log('tempActDetails: ', this.tempActDetails);
    this.activeModal.dismiss('Cross click');
  }

}
