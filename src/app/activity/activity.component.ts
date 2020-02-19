import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css', '../material/material.component.css']
})
export class ActivityComponent implements OnInit {
  @ViewChild('elActDowntime', {static: true}) elActDowntime: ElementRef;
  @ViewChild('elActPackedQty', {static: true}) elActPackedQty: ElementRef;
  @ViewChild('elActRemarks', {static: true}) elActRemarks: ElementRef;

  elements = [ this.elActDowntime, this.elActPackedQty, this.elActRemarks ];

  actPackedQty: any;
  actDowntime: any;
  actRemarks: any;

  activities = [
    {
      start_time: '11:00',
      end_time: '12:00',
      packed: 1600,
      adjustment: 0,
      downtime: '',
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
      downtime: '',
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
      downtime: '',
      remarks: '',
      last_updated_by: 'R. Cerico',
      date_entered: '12/17 09:02',
      date_updated: ''
    }
  ];
  constructor() { }

  ngOnInit() {
  }

  onKeyUp(event) {
    const element = event.srcElement.name.toString();
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

  onKeyDown(event) {
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

}
