import { Injectable } from '@angular/core';
import { Http,Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import {StorageService} from '../shared/storage.service';
@Injectable()
export class CredentialService {
  public baseUrl: string = "http://planning.ind-cloud.everdata.com/api";
  login: any = false;
  headers: any;
  access_token: string;
  private loggedIn = false;
  constructor(private http: Http, private storageService:StorageService) {    
    this.loggedIn = !!localStorage.getItem('access_token');
  }

  resetLoginStatus() {
    this.login = false;
  }

  isLoggedIn() {
    let access_token:any = localStorage.getItem("access_token");
    if (access_token) {
      return !this.login;
    } else {
      return this.login;
    }
  }

  verifyUser(data: Object) {
    return this.http.post(this.baseUrl + "/login", data)
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  logOut(){
    localStorage.clear();    
  }

  private extractData(res: Response) {
    let body = res.json();
    return body || {};
  }

  private handleError(error: Response | any) {
    return Observable.throw(error.status);
  }
}