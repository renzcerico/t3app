// import { environment } from './../../environments/environment.prod';
import { Injectable } from '@angular/core';
import Header from '../classes/header';
import { Observable, throwError } from 'rxjs';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { ApiService } from './api.service';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import * as io from 'socket.io-client';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  private headerSource = new Subject<any>();
  private headerCountSource = new Subject<Array<object>>();
  header$ = this.headerSource.asObservable();
  headerCount$ = this.headerCountSource.asObservable();
  header: Header;
  url: string;
  getDataRes: any;
  visibleStatus: any;
  userForwardList = new Subject<any>();
  userForwardList$ = this.userForwardList.asObservable();
  headerCountObj: Array<object>;
  currentData;
  socket;

  getHeaderCountPerStatus = new Observable((observer) => {
    this.socket.on('updateHeaderStatus', (data) => {
      observer.next(data);
    });
  });

  getUpdatedHeader = new Observable((observer) => {
    this.socket.on('headerUpdated', async (data) => {
      const user = await this.apiService.isAuth().toPromise();
      const userID = (user ? user.ID : 0);
      console.log(user);
      console.log(userID);
      console.log(data.user);
      if (data.barcode === this.currentData.header_obj.BARCODE) {
        if (data.user !== userID && userID !== 0) {
          Swal.fire({
            title: 'Notice',
            text: 'Transaction modified by another user.',
            icon: 'info',
            confirmButtonText: 'Reload',
          }).then( val => {
            this.getData(data.barcode);
          });
        } else {
          this.getData(data.barcode);
        }
      }
    });
  });

  constructor(private apiService: ApiService,
              public http: HttpClient,
              ) {
    // this.getHeaderCountPerStatus();
    this.setUpdatedHeaderCountPerStatus();
    this.url = environment.BE_SERVER;
    this.socket = io(this.url);

    this.getUpdatedHeader.subscribe();
  }

  setHeaderObj(headerObj) {
    // const header = new Header(headerObj);
    this.headerSource.next(headerObj);
  }

  async setUpdatedHeaderCountPerStatus() {
    await this.apiService.getHeaderCountPerStatus().toPromise()
    .then(
        res => {
          this.socket.emit('headerStatusUpdate', res);
        }
    );
  }

  getHeaderByStatus(data): Observable<any> {
    // const data = 'SO01-022020-818454';
    // data = String(data).toUpperCase();
    return this.http.post(`${this.url}` + '/api/get_header_by_status/', data, this.apiService.setHeaders());
  }

  async getData(barcodeNum) {
    await this.apiService.getAllByBarcode(barcodeNum).toPromise()
    .then(
        res => {
            this.getDataRes = res;
        }
    );
    if (this.getDataRes.isExisting) {
        this.currentData = this.getDataRes;
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
  }

  getUserForwardList() {
    this.apiService.forwardList()
    .subscribe(
        res => {
            this.userForwardList.next(res);
            console.log(res);
        },
        err => {
            console.log(err);
        }
    );
  }

  refreshSource() {
    if (this.currentData) {
      this.setHeaderObj(this.currentData);
    }
  }

  // getHeaderCountPerStatus(): Observable<Array<object>> {
  //   return new Observable((observer) => {
  //     this.socket.on('updateHeaderStatus', (data) => {
  //       observer.next(data);
  //     });
  //   });
  // }
}
