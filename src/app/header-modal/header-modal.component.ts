import { HeaderService } from './../services/header.service';
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-header-modal',
  templateUrl: './header-modal.component.html',
  styleUrls: ['./header-modal.component.css', '../app.component.css', '../material/material.component.css']
})
export class HeaderModalComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal, public headerService: HeaderService) { }
  currentStatus = '';
  currentStatusDesc = '';
  status: number;
  headerList: Array<any> = [];

  ngOnInit() {
    if (this.status === 1) {
      this.currentStatus = 'dot status-wip';
      this.currentStatusDesc = 'WIP';
    } else if (this.status === 2) {
      this.currentStatus = 'dot status-open';
      this.currentStatusDesc = 'OPEN';
    } else if (this.status === 3) {
      this.currentStatus = 'dot status-completed';
      this.currentStatusDesc = 'COMPLETED';
    } else if (this.status === 4) {
      this.currentStatus = 'dot status-closed';
      this.currentStatusDesc = 'CLOSED';
    }
    this.getHeaderbyStatus(this.status);
  }

  async getHeaderbyStatus(statusCode) {
    await this.headerService.getHeaderByStatus(statusCode).toPromise()
    .then(
        res => {
            this.headerList = res;
        }
    );
  }

  openHeader(barcode) {
    this.headerService.getData(barcode);
    this.activeModal.dismiss('Cross click');
  }

}
