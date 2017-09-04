import { Component, OnInit, AfterViewInit } from '@angular/core';
import { UniversityService } from "../../shared/UTI.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { StorageService } from "../../shared/storage.service";
@Component({
  selector:'activities',
  templateUrl:'./activity.html',
  styleUrls:['./activity.css','./../planner.component.css']
})
export class ActivityComponent implements OnInit,AfterViewInit{
  public goals:any[];
  public activityForm:FormGroup;
  public quarter:any[] = ["Q1","Q2","Q3","Q4"];
  public objectives:any[];
  public initiatives:any[];
  constructor(public orgService:UniversityService,
              public formBuilder: FormBuilder,
              public commonService:StorageService){
              this.orgService.getObjectives().subscribe((response:any)=>{
                this.objectives = response;
              });
              
              this.activityForm = this.setActivity();
  }

  ngAfterViewInit(){
  }

  getActivities(){
    this.orgService.getActivities().subscribe((response:any)=>{
      this.goals = response;
    });
  }

  ngOnInit(){
    this.getActivities();
  }

  getInitiative(objId:any){
    this.orgService.fetchInitiative(objId).subscribe((res:any)=>{
      if(res.status === 204){
        this.initiatives = [];
        alert("There is no initiatives of corresponding Goal");
      }else{
        this.initiatives = res;        
      }
    });
  }

  setActivity() {
    return this.formBuilder.group({
      "objectiveId":['', [Validators.required]],
      "initiativeId":['',[Validators.required]],
      "activity": ['', [Validators.required]],
      // "measures": this.formBuilder.array([this.setMeasure()])
    });
  }
  setMeasure() {
    return this.formBuilder.group({
      "measure": ['', [Validators.required]],
      "frequencyId": [1, [Validators.required]],
      "measureUnit": ['', [Validators.required]],
      "currentLevel": ['', [Validators.required]],
      "direction": ['', [Validators.required]],
      "annualTarget": this.formBuilder.array(this.setAnnualTarget())
    });
  }
  setAnnualTarget() {
    const annualTarget:any[] = [];
    this.commonService.getData('org_info').cycle.forEach((element:any) => {
      annualTarget.push(this.inItTargetIn(element));
    });
    return annualTarget;
  }
  inItTargetIn(year:any) {
    return this.formBuilder.group({
      "year": [year, [Validators.required]],
      "levels": this.formBuilder.array([this.inItLevels(this.quarter[0])]),
      "estimatedCost": ['', [Validators.required]]
    });
  }

  inItLevels(q:any) {
    return this.formBuilder.group({
      "quarter": [q],
      "startDate": ["2017-04-01"],
      "endDate":["2018-04-15"],
      "estimatedTargetLevel": ['', [Validators.required]]
    });
  }

  submitActivity(){
    delete this.activityForm.value["objectiveId"];
    // this.activityForm.value['initiativeId'] = this.selectedInitiative.id;
    this.orgService.saveActivity(this.activityForm.value)
    .subscribe(response =>{
      // this.selectedInitiative.activities.push(response);
      // $('#activityModal').modal('hide');
      this.getActivities();
      this.activityForm = this.setActivity();
    });    
  }

  getRowSpan(array:any[]){
    var rowSpan = 1;
    rowSpan += array.length;
    array.forEach((element) => {
      rowSpan += element.activities.length;
      // element.activities.forEach((innerElement:any) => {
      //   rowSpan += innerElement.measures.length;
      // });
    });
    if(rowSpan == 1)
      return rowSpan+1;
    return rowSpan;
  }

  getRowSpanOfIni(array:any[]){
    var rowSpan = 1;
    rowSpan += array.length*2;
      // array.forEach((innerElement:any) => {
      //   rowSpan += innerElement.measures.length;
      // });
      return rowSpan;
  }
}