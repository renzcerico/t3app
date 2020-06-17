import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, Observer } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  url: any = 'http://localhost:3000';
  response: any = {};
  constructor(public http: HttpClient) { }

    setHeaders() {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type':  'application/json',
            })
        };
        return httpOptions;
    }

    getHeader(): Observable<any> {
        return this.http.get(`${this.url}` + '/api/header');
    }

    loginAPI(data): Observable<any> {
        return this.http.post(`${this.url}` + '/api/login', data, this.setHeaders());
    }

    getManpower(): Observable<any> {
        return this.http.get(`${this.url}` + '/api/personnel');
    }

    getExternalData(barcode): Observable<any> {
        barcode = 'SO01-022020-818454';
        return this.http.get('http://t2apps.tailinsubic.com/api/t2_header?prodno=' + barcode);
    }

    getAllByBarcode(data): Observable<any> {
        // const data = 'SO01-022020-818454';
        data = String(data).toUpperCase();
        return this.http.get(`${this.url}` + '/api/get_all_by_barcode/' + data);
    }

    header(data): Observable<any> {
        return this.http.post(`${ this.url }` + '/api/store_all', data);
    }

    createAccount(data): Observable<any> {
        return this.http.post(`${ this.url }` + '/api/accounts', data);
    }

    resetPassword(id): Observable<any> {
        return this.http.post(`${ this.url }` + '/api/accounts/reset', id);
    }

    getAllAccounts(): Observable<any> {
        return this.http.get(`${ this.url }` + '/api/accounts');
    }

    getAccountById(id): Observable<any> {
        return this.http.get(`${ this.url }` + '/api/accounts/' + id);
    }

    getDowntimeTypes(): Observable<any> {
        return this.http.get(`${this.url}` + '/api/get_downtime_types');
    }

    getNewBatch(): Observable<any> {
        const url = 'http://localhost:3001';
        return this.http.get(`${url}` + '/api/t3Batch_info/' + 1);
    }

    getHeaderCountPerStatus(): Observable<any> {
        return this.http.get(`${this.url}` + '/api/get_header_count_per_status');
    }

}
