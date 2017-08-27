import {Component} from '@angular/core';
import { UniversityService } from "../../shared/UTI.service";
import { FormBuilder, Validators, FormGroup, FormArray } from "@angular/forms";
import { StorageService } from "../../shared/storage.service";
@Component({
  selector:'measure',
  templateUrl:'./measure.html',
  styleUrls:['./measure.css','./../planner.component.css']
})
export class MeasureComponent{
  objectives: any;
  initiatives: any;
  activities: any;

  public goals:any;
  public measureForm: FormGroup;
  public quarter:any[] = ["Q1","Q2","Q3","Q4"];
  public quarters:any[] =[
    {
        "id": 1,
        "endDate": "31/03/",
        "startDate": "01/01/",
        "quarter": "q1"
    },
    {
        "id": 2,
        "endDate": "31/06/",
        "startDate": "01/04/",
        "quarter": "q2"
    },
    {
        "id": 3,
        "endDate": "31/09/",
        "startDate": "01/07/",
        "quarter": "q3"
    },
    {
        "id": 4,
        "endDate": "31/12/",
        "startDate": "01/10/",
        "quarter": "q4"
    }
];
selectedQuarter:any;
  constructor(public orgService:UniversityService,
  public formBuilder: FormBuilder,public commonService:StorageService){
    this.measureForm = this.setMeasure();
    this.orgService.getObjectives().subscribe((response:any)=>{
      this.objectives = response;
    });
  }

  ngOnInit(){
    this.getMeasure();
    this.getQuarter();
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

  getActivities(initId:any){
    this.orgService.fetchActivities(initId).subscribe((response:any)=>{
      this.activities = response;
    });
  }

  getMeasure(){
    this.orgService.getMeasures().subscribe((response:any)=>{
      this.goals = response;
    })
  }

  getQuarter(){
    this.orgService.getQuarter().subscribe((res:any)=>{
      this.quarters = res;
    })
  }

  setMeasure() {
    return this.formBuilder.group({
      "objectiveId":['', [Validators.required]],
      "initiativeId":['',[Validators.required]],
      "activityId": ['', [Validators.required]],
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
      "levels": this.formBuilder.array([this.setLevels(0)]),
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

  setLevels(f:any){
    var level:any = this.quarters[f];
    delete level["id"];
    level["estimatedTargetLevel"] = ['', [Validators.required]];
    return this.formBuilder.group(level);
  }

  setLevelByIndex(form:any,index:any){
    console.log(index);
    const fm = <FormGroup>form;
    fm.patchValue(this.setLevels(index).value);
    // console.log(fm.value);
    // fm = this.setLevels(3);
    // console.log(fm.value);
  }

  setTargetTable(form:any, e:any) {
    for (var index = 0; index < this.commonService.getData('org_info').cycle.length; index++) {
      form[index].controls['levels'] = this.formBuilder.array([]);
      const levels = <FormArray>form[index].controls['levels'];
      for (var i = 0; i < e; i++) {
        levels.push(this.setLevels(i));
      }
    }
  }

  submitMeasure(){
    console.log(this.measureForm.value);
    // this.measureForm.value['activityId'] = this.selectedActivity.id;
    this.orgService.saveMeasure(this.measureForm.value).subscribe((response:any) =>{
      this.getMeasure();
      this.measureForm = this.setMeasure();
      // this.selectedActivity.measures.push(response);
      // $('#measureModal').modal('hide');
    }, error =>{
      console.log(error);
    });
  }

  getRowSpan(array:any[]){
    var rowSpan = 1;
    rowSpan += array.length;
    array.forEach((element) => {
      rowSpan += element.activities.length;
      element.activities.forEach((innerElement:any) => {
        rowSpan += innerElement.measures.length;
      });
    });
    if(rowSpan == 1)
      return rowSpan+1;
    return rowSpan;
  }

  getRowSpanOfIni(array:any[]){
    var rowSpan = 1;
    rowSpan += array.length*2;
      array.forEach((innerElement:any) => {
        rowSpan += innerElement.measures.length;
      });
      return rowSpan;
  }
}