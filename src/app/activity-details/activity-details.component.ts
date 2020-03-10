import {
  Component,
  ElementRef,
  ViewChildren,
  QueryList,
  OnInit
} from '@angular/core';
import {ActivityService} from '../activity.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-activity-details',
  templateUrl: './activity-details.component.html',
  styleUrls: ['./activity-details.component.css']
})
export class ActivityDetailsComponent implements OnInit {

  activities: any = [];
  mLotNumber: string;
  mPacked = 0;
  selectedActivityIndex: number;
  @ViewChildren('modalHeaderInput') modalHeaderInput !: QueryList<ElementRef>;

  constructor(private activityService: ActivityService, public activeModal: NgbActiveModal) {
    activityService.activities$.subscribe(
      activities => {
        this.activities = activities;
      }
    );
  }

  ngOnInit() {
    console.log(this.selectedActivityIndex);
    console.log(this.activities);
  }

  modalEnter(event) {
    const elArr = this.modalHeaderInput.toArray();
    console.log(elArr);
    const active = elArr.findIndex(index => {
      return (index.nativeElement.parentElement === event.target.parentElement);
    });

    if (event.target.attributes.required && !event.target.value) {
      return;
    }

    if (active < elArr.length - 1) {
      elArr[active + 1].nativeElement.focus();
    } else {

      const newActivityDetail = {
        LOT_NUMBER      : this.mLotNumber,
        PACKED_QTY      : this.mPacked,
        ADJ_QTY         : 0
      };
      this.activities[this.selectedActivityIndex].ACTIVITY_DETAILS.unshift(newActivityDetail);
      this.mPacked = 0;
      this.mLotNumber = '';
      elArr[0].nativeElement.focus();
    }

  }

}
