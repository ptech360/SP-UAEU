import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Response, Http, Headers, RequestOptions } from '@angular/http';
import { StorageService } from './storage.service';
import { CustomHttpService } from './default.header.service';


import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class UniversityService {

  private baseUrl: string = "";

  constructor(public http: CustomHttpService,
    public htttp: Http,
    public con: StorageService) {
    this.baseUrl = con.baseUrl + con.getData('user_roleInfo')[0].role;
  }

  public orgInitialSetup(data: any) {
    
    return this.http.post(this.baseUrl + "/initialSetup", data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  public addValue(val: any[]) {
    
    return this.http.post(this.baseUrl + "/values", val)
      .map(this.extractData)
      .catch(this.handleError);
  }

  public updateValue(val: any, id: any) {
    
    return this.http.put(this.baseUrl + "/values/" + id, val)
      .map(this.extractData)
      .catch(this.handleError);
  }

  public deleteValue(id: any) {
    
    return this.http.delete(this.baseUrl + "/values/" + id)
      .map(this.extractData)
      .catch(this.handleError);
  }

  public getUniversities() {
    
    return this.http.get(this.baseUrl + "/university")
      .map(this.extractData)
      .catch(this.handleError);
  }

  public fetchOrganizationInfo() {
    
    return this.http.get(this.baseUrl + "/university")
      .map(this.extractData)
      .catch(this.handleError);
  }

  public fetchObjectives(cycleId: any) {
    
    return this.http.get(this.baseUrl + "/cycle/" + cycleId + "/objective")
      .map(this.extractData)
      .catch(this.handleError);
  }

  public getObjectives(){
    return this.http.get(this.baseUrl + "/objectives")
    .map(this.extractData)
    .catch(this.handleError);
  }

  public getInitiatives(){
    return this.http.get(this.baseUrl + "/initiatives")
    .map(this.extractData)
    .catch(this.handleError);
  }

  public getActivities(){
    return this.http.get(this.baseUrl + "/activities")
    .map(this.extractData)
    .catch(this.handleError);
  }

  public getMeasures(){
    return this.http.get(this.baseUrl + "/measures")
    .map(this.extractData)
    .catch(this.handleError);
  }

  public addObjective(objective: any) {
    
    return this.http.post(this.baseUrl + "/objective", objective)
      .map(this.extractData)
      .catch(this.handleError);
  }

  public addInitiative(initiative: any) {
    
    return this.http.post(this.baseUrl + "/initiative", initiative)
      .map(this.extractData)
      .catch(this.handleError);
  }

  public fetchInitiative(goalId: any) {    
    return this.http.get(this.baseUrl + "/objective/" + goalId + "/initiative")
      .map(this.extractData)
      .catch(this.handleError);
  }

  public fetchActivities(initId:any){
    return this.http.get(this.baseUrl + "/initiative/"+initId+"/activity")
    .map(this.extractData)
    .catch(this.handleError); 
  }

  public fetchAssignedActivity(departmentIds: any[]) {
    return this.http.get(this.baseUrl + "/department/" + departmentIds + "/result")
      .map(this.extractData)
      .catch(this.handleError);
  }

  public saveQuarteResult(data: any, quarterId: any) {
    return this.http.post(this.baseUrl + "/result", data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  public updateQuarteResult(data: any, resultId: any) {
    return this.http.put(this.baseUrl + "/result/" + resultId, data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  public lockResult(resultId: any){
    return this.http.put(this.baseUrl + "/result/" + resultId,{status:"locked"})
    .map(this.extractData)
    .catch(this.handleError);
  }

  public saveEvidence(data: any, resultId: any) {
    var options = new RequestOptions({
      headers: new Headers({
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
      })
    });
    return this.htttp.post(this.baseUrl + "/result/" + resultId + "/evidance", data, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  public saveComment(resultId: any, comment: any) {    
    return this.http.post(this.baseUrl + "/result/" + resultId + "/discussion", comment)
      .map(this.extractData)
      .catch(this.handleError);
  }


  public fetchDepartments() {    
    return this.http.get(this.baseUrl + "/university/1/department")
      .map(this.extractData)
      .catch(this.handleError);
  }

  public assignActivity(actId: any, departments: any) {    
    return this.http.post(this.baseUrl + "/assign/activity/" + actId + "/departments", { 'departments': departments })
      .map(this.extractData)
      .catch(this.handleError);
  }

  public saveActivity(activity: any) {    
    return this.http.post(this.baseUrl + "/activity", activity)
      .map(this.extractData)
      .catch(this.handleError);
  }

  public getSpis(){
    return this.http.get(this.baseUrl + "/spi")
    .map(this.extractData)
    .catch(this.handleError);
  }

  public saveSpi(spi: any) {    
    return this.http.post(this.baseUrl + "/spi", spi)
      .map(this.extractData)
      .catch(this.handleError);
  }

  public saveMeasure(measure: any) {    
    return this.http.post(this.baseUrl + "/measures", measure)
      .map(this.extractData)
      .catch(this.handleError);
  }

  public updateMisionVision(object:any){    
    return this.http.put(this.baseUrl + "/initialSetup", object)
      .map(this.extractData)
      .catch(this.handleError);
  }

  public getQuarter(){
    return this.http.get(this.baseUrl + "/quarters")
    .map(this.extractData)
    .catch(this.handleError);
  }

  private extractData(res: Response) {
    if (res.status === 204) { return res; }
    let body = res.json();
    return body || {};
  }


  private handleError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
      if (error.status === 0) {
        errMsg = `${error.status} - "Something is wrong.."`;
      }
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    return Observable.throw(errMsg);
  }

}