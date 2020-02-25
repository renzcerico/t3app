import {
  Component,
  ViewChild,
  ElementRef,
  QueryList,
  AfterViewInit,
  ViewChildren,
} from '@angular/core';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css', '../material/material.component.css']
})
export class ActivityComponent {
  @ViewChild('elActLotNumber', {static: true}) elActLotNumber: ElementRef;
  @ViewChild('elActDowntime', {static: true}) elActDowntime: ElementRef;
  @ViewChild('elActPackedQty', {static: true}) elActPackedQty: ElementRef;
  @ViewChild('elActRemarks', {static: true}) elActRemarks: ElementRef;
  @ViewChildren('contentTr') contentTr !: QueryList<ElementRef>;
  @ViewChildren('editableTd') editableTd !: QueryList<ElementRef>;
  elements = [this.elActDowntime, this.elActPackedQty, this.elActRemarks ];

  actLotNumber: any;
  actPackedQty: any;
  actDowntime: any;
  actRemarks: any = '';

  activities = [
    {
      start_time: '11:00',
      end_time: '12:00',
      packed: 1600,
      adjustment: 0,
      downtime: 0,
      remarks: '',
      last_updated_by: 'R. Cerico',
      date_entered: '12/17 11:08',
      date_updated: ''
    },
    {
      start_time: '09:00',
      end_time: '10:00',
      packed: 1300,
      adjustment: -153,
      downtime: 0,
      remarks: '',
      last_updated_by: 'R. Cerico',
      date_entered: '12/17 10:15',
      date_updated: ''
    },
    {
      start_time: '08:00',
      end_time: '09:00',
      packed: 1200,
      adjustment: 1,
      downtime: 0,
      remarks: '',
      last_updated_by: 'R. Cerico',
      date_entered: '12/17 09:02',
      date_updated: ''
    }
  ];
  constructor() { }

  handleKeyUp(event) {
    const element = event.target.name.toString();
    event.preventDefault();

    const newActivity = {
      start_time: '11:00',
      end_time: '12:00',
      packed: this.actPackedQty,
      adjustment: 0,
      downtime: this.actDowntime,
      remarks: this.actRemarks,
      last_updated_by: 'R. Cerico',
      date_entered: '12/17 11:08',
      date_updated: ''
    };

    if (!this.actPackedQty) {
      this.elActPackedQty.nativeElement.focus();
      return;
    }

    if (!this.actDowntime) {
      if (element === 'packedQty') {
        this.elActDowntime.nativeElement.focus();
        return;
      } else if (element === 'downtime') {
        this.elActRemarks.nativeElement.focus();
        return;
      }
    }

    if (!this.actRemarks) {
      if (element !== 'remarks') {
        this.elActRemarks.nativeElement.focus();
        return;
      } else {
        this.addActivity(newActivity);
        this.clearInputs();
        return;
      }
    }

    this.addActivity(newActivity);
    this.clearInputs();
  }

  handleKeyDown(event) {
    event.preventDefault();
  }

  addActivity(newActivity) {
    this.activities.unshift(newActivity);
  }

  clearInputs() {
    this.actDowntime = '';
    this.actPackedQty = '';
    this.actRemarks = '';
    this.elActPackedQty.nativeElement.focus();
  }

  handleTrKeyUp(event) {
    const elArr = this.editableTd.toArray();
    const active = elArr.findIndex(index => {
      return (index.nativeElement.parentElement === event.target.parentElement);
    });

    if (active < elArr.length - 1) {
      elArr[active + 1].nativeElement.focus();
    } else {
      event.target.blur();
    }
  }
}
