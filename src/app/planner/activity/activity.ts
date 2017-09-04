import { Component, OnInit, AfterViewInit } from '@angular/core';
import { UniversityService } from "../../shared/UTI.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { StorageService } from "../../shared/storage.service";

declare let $:any;

@Component({
  selector:'activities',
  templateUrl:'./activity.html',
  styleUrls:['./activity.css','./../planner.component.css']
})
export class ActivityComponent implements OnInit,AfterViewInit{
  // [x: string]: any;
  public goals: any[];
  public goalsCopy: any[];
  
  public activityForm:FormGroup;
  public quarter:any[] = ["Q1","Q2","Q3","Q4"];
  public objectives:any[];
  public objectiveIndex:any[]=[];
  public initiatives:any[];
  public isUpdating:boolean = false;
  constructor(public orgService:UniversityService,
              public formBuilder: FormBuilder,
              public commonService:StorageService){
              this.orgService.getObjectivesWithHierarchy().subscribe((response:any)=>{
                this.objectives = response;
              });
              
              this.activityForm = this.setActivity();
  }

  
  ngOnInit(){
    this.getActivities();
  }

  ngAfterViewInit(){

  }


  getActivities(){
    this.orgService.getActivities().subscribe((response:any)=>{
      this.goals = response;
      this.goalsCopy = response;
    });
  }

  emptySearchResult:any;
  search(key:any){
    this.goals = this.goalsCopy;
    let val = key.target.value;
    if (val && val.trim() != '') {
      this.emptySearchResult = false;
      this.goals = this.goalsCopy.filter((item: any) => {
        return (item.objective.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
      if (this.goals.length === 0)
        this.emptySearchResult = true;
      else
        this.emptySearchResult = false;
    }
  }

  getInitiative(objId:any){
    if(objId!=null)    
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
    if(!this.isUpdating){
      this.orgService.saveActivity(this.activityForm.value)
      .subscribe(response =>{
        $('#activityModal').modal('show');
        this.getActivities();
        this.activityForm.controls["activity"].reset();
      });
    }else{
      delete this.activityForm.value["initiativeId"];
      this.orgService.updateActivity(this.seletedActivity.activityId,this.activityForm.value).subscribe((res:any)=>{
        this.getActivities();
        $('#activityModal').modal('show');
        this.isUpdating = false;
        this.activityForm.reset();
      });
    }
  }

  deleteActivity(activityId:any,activities:any[],index:any){
    if(confirm("Are you sure you want to delete this Activity?"))
    this.orgService.deleteActivity(activityId).subscribe((res:any)=>{
      console.log(res);
      activities.splice(index,1);
    })
  }
  seletedActivity:any;
  updateActivity(objective:any,initiative:any,activity:any){
    this.isUpdating = true;
    this.seletedActivity = activity;
    this.activityForm.controls["objectiveId"].patchValue(objective.objectiveId);
    this.activityForm.controls["initiativeId"].patchValue(initiative.initiativeId);
    this.activityForm.controls["activity"].patchValue(activity.activity);
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