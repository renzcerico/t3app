import { ActivityDetailsComponent } from './../activity-details/activity-details.component';
import {
  Component,
  ElementRef,
  ViewChildren,
  QueryList,
} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-activity-downtime',
  templateUrl: './activity-downtime.component.html',
  styleUrls: ['./activity-downtime.component.css']
})
export class ActivityDowntimeComponent {

  activities: any = [];
  mLotNumber: string;
  mPacked = 0;
  selectedActivityIndex: number;
  downtimeTypes: any = [];
  selectedDowntimeTypeIndex;
  selectedDowntimeType: any = {};
  @ViewChildren('modalHeaderInput') modalHeaderInput !: QueryList<ElementRef>;

  constructor(public activeModal: NgbActiveModal) {
  }

  // get selectedDowntimeType() {
  //   return this.downtimeTypes[this.selectedActivityIndex];
  // }

  test() {
    console.log(this.selectedDowntimeType);
  }
}
