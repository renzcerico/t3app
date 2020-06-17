import { Manpower } from './../classes/manpower';
import { ManpowerService } from './../services/manpower.service';
import { Component, OnInit, AfterViewInit, ViewChild, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-manpower',
  templateUrl: './manpower.component.html',
  styleUrls: ['../material/material.component.css', '../manpower/manpower.component.css']
})
export class ManpowerComponent implements OnInit {
  @ViewChildren('tdEditable') tdEditable !: QueryList<ElementRef>;
  positions = ['In-Feeder', 'Inspector 1', 'Inspector 2', 'Roller', 'Out-Feeder', 'Strapping', 'Stamping'];
  manpowers: any = [];
  accounts: Array<any>;
  manpowerSelected = [];
  manpowerOnFocus = 0;

  apiResponse: any;

  constructor(public apis: ApiService, private manpowerService: ManpowerService) {
    this.manpowerService.manpower$.subscribe(
      manpower => {
        this.manpowers = manpower;
      }
    );
  }

  ngOnInit() {
    // this.getManpower();
    this.getAllAccounts();
    console.log('manpoweeeer: ', this.manpowers);
    console.log(this.accounts);
  }

  async getAllAccounts() {
    await this.apis.getAllAccounts().toPromise()
    .then (
      res => {
        this.accounts = res;
      }
    );
  }

  handleChange(event) {
    const currValIndex = event.srcElement.attributes.selected_index.value;
    const options = event.srcElement.options;
    const newValIndex = options.selectedIndex - 1;
    if (currValIndex >= 0) {
      this.accounts[currValIndex].disabled = 0;
    }
    event.srcElement.attributes.selected_index.value = newValIndex;
    console.log(newValIndex);
    if (newValIndex >= 0) {
      this.accounts[newValIndex].disabled = 1;
    }
    console.log(this.manpowers[newValIndex]);
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

  preventEnter(e) {
    e.preventDefault();
  }

}
