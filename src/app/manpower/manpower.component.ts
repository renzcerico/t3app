import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-manpower',
  templateUrl: './manpower.component.html',
  styleUrls: ['../material/material.component.css', '../manpower/manpower.component.css']
})
export class ManpowerComponent implements OnInit {
  positions = ['In-Feeder', 'Inspector 1', 'Inspector 2', 'Roller', 'Out-Feeder', 'Strapping', 'Stamping'];
  manpowers = [];

  apiResponse: any;
  constructor(public apis: ApiService) { }

  ngOnInit() {
    this.getManpower();
  }

  getManpower() {
    this.apis.getManpower()
      .subscribe(
        res => {
          this.apiResponse = res;

          res.map((e) => {
            const json = {
              FULLNAME: e.FULLNAME,
              PERSON_ID: e.PERSON_ID
            };

            this.manpowers.push(json);
          });
        },
        err => {
          this.apiResponse = err;
          console.log(err);
        }
      );
  }

  time(value: string) {
    console.log(value);
  }

  autogrow() {
    const textArea = document.getElementsByClassName('remarks');
    // textArea.style.overflow = 'hidden';
    // textArea.style.height = '0px';
    // textArea.style.height = textArea.scrollHeight + 'px';
  }

}
