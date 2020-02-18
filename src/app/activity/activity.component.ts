import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css', '../material/material.component.css']
})
export class ActivityComponent implements OnInit {
  blue = true;
  red = false;
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

}
