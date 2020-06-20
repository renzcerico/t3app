import { Injectable } from '@angular/core';
import Header from '../classes/header';
import { Observable, throwError } from 'rxjs';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { ApiService } from './api.service';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  private headerSource = new Subject<any>();
  private headerCountSource = new Subject<Array<object>>();
  header$ = this.headerSource.asObservable();
  headerCount$ = this.headerCountSource.asObservable();
  header: Header;
  url: any = 'http://localhost:3000';
  getDataRes: any;
  visibleStatus: any;
  userForwardList = new Subject<any>();
  userForwardList$ = this.userForwardList.asObservable();
  currentData;
  constructor(private apiService: ApiService,
              public http: HttpClient,
              ) {
    this.getHeaderCountPerStatus();
    this.getUserForwardList();
    this.header$.subscribe(data => {
      this.currentData = data;
    });
  }

  setHeaderObj(headerObj) {
    // const header = new Header(headerObj);
    this.headerSource.next(headerObj);
  }

  async getHeaderCountPerStatus() {
    await this.apiService.getHeaderCountPerStatus().toPromise()
    .then(
        res => {
          this.headerCountSource.next(res);
        }
    );
  }

  getHeaderByStatus(data): Observable<any> {
    // const data = 'SO01-022020-818454';
    data = String(data).toUpperCase();
    return this.http.get(`${this.url}` + '/api/get_header_by_status/' + data);
  }

  async getData(barcodeNum) {
    await this.apiService.getAllByBarcode(barcodeNum).toPromise()
    .then(
        res => {
            this.getDataRes = res;
        }
    );
    if (this.getDataRes.isExisting) {
        this.setHeaderObj(this.getDataRes);
        // this.activitiesSource.next(this.getDataRes.activity_collection);
        // this.materialsSource.next(this.getDataRes.materials_collection);

        const barcodeStatus = this.getDataRes.header_obj.STATUS;
        // this.visibleStatus(barcodeStatus);
    } else {
        await this.apiService.getNewBatch().toPromise()
        .then(
            res => {
                // this.materialService.setMaterials(res.material_collection);
                // this.setHeaderObj(res.batch_collection[0]);
                // this.activityService.setActivities([]);
                // this.getDataRes = res;
            }
        );
    }
    // console.log(this.headerObj);
  }

  getUserForwardList() {
    this.apiService.forwardList()
    .subscribe(
        res => {
            this.userForwardList.next(res);
            // console.log(res);
        },
        err => {
            console.log(err);
        }
    );
  }

  refreshSource() {
    console.log(this.currentData);
    this.setHeaderObj(this.currentData);
  }
}
