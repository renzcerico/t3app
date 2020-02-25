import { Component, OnInit, AfterContentChecked, ViewChild, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-manpower',
  templateUrl: './manpower.component.html',
  styleUrls: ['../material/material.component.css', '../manpower/manpower.component.css']
})
export class ManpowerComponent implements OnInit, AfterContentChecked {
  @ViewChildren('tdEditable') tdEditable !: QueryList<ElementRef>;
  positions = ['In-Feeder', 'Inspector 1', 'Inspector 2', 'Roller', 'Out-Feeder', 'Strapping', 'Stamping'];
  manpowers = [];
  manpowerSelected = [];
  manpowerOnFocus = 0;

  apiResponse: any;
  constructor(public apis: ApiService) { }

  ngOnInit() {
    this.getManpower();
  }

  ngAfterContentChecked() {
    this.manpowers;
  }

  getManpower() {
    this.apis.getManpower()
      .subscribe(
        res => {
          this.apiResponse = res;
          res.map((e) => {
            const json = {
              FULLNAME: e.FULLNAME,
              PERSON_ID: e.PERSON_ID,
              disabled: false
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

  time(value: string, event) {
    const editable = this.tdEditable.toArray();

    const active = editable.findIndex(index => {
      return (index.nativeElement.parentElement === event.target.parentElement);
    });

    if (active < editable.length - 1) {
        editable[active + 1].nativeElement.focus();
    } else {
      event.target.blur();
    }
  }

  autogrow() {
    const textArea = document.getElementsByClassName('remarks');
    // textArea.style.overflow = 'hidden';
    // textArea.style.height = '0px';
    // textArea.style.height = textArea.scrollHeight + 'px';
  }

  manpower(event) {
    const manpowerId = event.target.value || 0;

    manpowerId === 0 ? this.setManpower(this.manpowerOnFocus) : false;

    this.manpowers.filter(data => {
        data.PERSON_ID === parseInt(manpowerId, 10) ? this.setManpower(data) : false;
    });

  }

  preventEnter(e) {
    e.preventDefault();
  }

  setManpower(manpower) {
    this.manpowerSelected.push(manpower);

    this.manpowers.find(res => {
        if (res.PERSON_ID === parseInt(manpower.PERSON_ID, 10)) {
          res.disabled = true;
        }

        if (res.PERSON_ID === this.manpowerOnFocus) {
          res.disabled = false;
        }
    });

    this.manpowerOnFocus = manpower.PERSON_ID;
  }

  manpowerFocus(manpower) {
    this.manpowerOnFocus = parseInt(manpower, 10) || 0;
  }

  limit(val, key) {
    const pattern = /^['0-9']$/i;
    const count = val.toString().length;

    if (pattern.test(key)) {
      if (count === 4) {
        return false;
      }
    }
  }

}
