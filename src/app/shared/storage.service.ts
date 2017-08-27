import { Injectable, OnInit } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

@Injectable()
export class StorageService{
  // private url:string = "http://localhost:8080/strategyPlanningV3";
  public baseUrl: string = "http://planning.ind-cloud.everdata.com/api/";
  public hasRole:boolean;
  constructor() { 
    
  }

  public storeData(field_name:any, data:any) {
    if(field_name==="access_token")
      localStorage.setItem(field_name,data);
    else{
      localStorage.setItem(field_name,JSON.stringify(data));
    }
  }

  public getData(field_name:any) {
    let data = JSON.parse(localStorage.getItem(field_name));
    if (data) {
      return data;
    }
  }

}