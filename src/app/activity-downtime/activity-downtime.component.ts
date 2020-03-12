import {
  Component,
  ElementRef,
  ViewChildren,
  QueryList,
  OnInit
} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-activity-downtime',
  templateUrl: './activity-downtime.component.html',
  styleUrls: ['./activity-downtime.component.css']
})
export class ActivityDowntimeComponent implements OnInit {

  activities: any = [];
  mLotNumber: string;
  mPacked = 0;
  selectedActivityIndex: number;
  @ViewChildren('modalHeaderInput') modalHeaderInput !: QueryList<ElementRef>;

  constructor(public activeModal: NgbActiveModal) {
  }

  ngOnInit() {
    console.log(this.selectedActivityIndex);
    console.log(this.activities);
  }

}
