import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  url: any = 'http://localhost:3000';

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

    getData(barcode): Observable<any> {
        const testBarcode = 'SO01-022020-818454';
        return this.http.get('http://t2apps.tailinsubic.com/api/t2_header?prodno=' + testBarcode);
    }

    header(data): Observable<any> {
        return this.http.post(`${ this.url }` + '/api/header', data, this.setHeaders());
    }
}
