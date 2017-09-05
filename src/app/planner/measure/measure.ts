import {Component, AfterViewInit} from '@angular/core';
import { UniversityService } from "../../shared/UTI.service";
import { FormBuilder, Validators, FormGroup, FormArray } from "@angular/forms";
import { StorageService } from "../../shared/storage.service";
import {TreeView} from "./tree-view";

declare let $:any;

@Component({
  selector:'measure',
  templateUrl:'./measure.html',
  styleUrls:['./measure.css','./../planner.component.css']
})
export class MeasureComponent implements AfterViewInit{
  // [x: string]: any;
  objectives: any;
  initiatives: any;
  activities: any;
  departments:any;
  isUpdating:boolean=false;
  public goals:any; 
  public goalsCopy:any;  
  
  public quarter:any[] = ["Q1","Q2","Q3","Q4"];
  public measureForm: FormGroup;
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
selectedQuarter:any = 0;
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
    this.getDepartments();
  }

  ngAfterViewInit(){
    $(document).ready(function(){
      $('[data-toggle="tooltip"]').tooltip(); 
    });
    $("#myModal").on('hidden.bs.modal', function (e:any) {
      $(this).find("input[type=checkbox], input[type=radio]")
      .prop("checked", "")
      .end();
      
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
      this.goalsCopy = response;
    })
  }

  getQuarter(){
    this.orgService.getQuarter().subscribe((res:any)=>{
      this.quarters = res;
    })
  }

  getDepartments(){
    this.departmentIds = [];
    this.orgService.getDepartments().subscribe((res:any)=>{
      this.departments = res;
    })
  }
  public selectedMeasureId:any;
  assignDepartment(){
    this.orgService.assignMeasure(this.selectedMeasureId,this.departmentIds).subscribe((res:any)=>{
      console.log(res);
    })
  }

  public departmentIds:any[] = [];
  public department(event:any){
    if(!event.target.checked){
      this.departmentIds.splice(this.departmentIds.indexOf(event.srcElement.value),1);
    }else{
      this.departmentIds.push(event.srcElement.value);
    }
    console.log(this.departmentIds);
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
      "levels": this.formBuilder.array([this.setLevels(3)]),
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

  // setLevelByIndex(form:any,index:any){
  //   console.log(index);
  //   const fm = <FormGroup>form;
  //   fm.patchValue(this.setLevels(index).value);
  //   // console.log(fm.value);
  //   // fm = this.setLevels(3);
  //   // console.log(fm.value);
  // }

  setTargetTable(form:any, e:any) {
    for (var index = 0; index < this.commonService.getData('org_info').cycle.length; index++) {
      form[index].controls['levels'] = this.formBuilder.array([]);
      const levels = <FormArray>form[index].controls['levels'];
      for (var i = 0; i < e; i++) {
        if(e==2)
          levels.push(this.setLevels(2*i+1));
        else if(e==1)
          levels.push(this.setLevels(3));
        else
          levels.push(this.setLevels(i));
          
      }
    }
  }

  submitMeasure(){
    console.log(this.measureForm.value);
    delete this.measureForm.value["objectiveId"];
    delete this.measureForm.value["initiativeId"];
    this.orgService.saveMeasure(this.measureForm.value).subscribe((response:any) =>{
      this.getMeasure();
      // this.measureForm = this.setMeasure();
      // this.selectedActivity.measures.push(response);
      $('#measureModal').modal('show');
      this.measureForm.reset({measure:'',frequencyId:1,measureUnit:'',currentLevel:'',direction:'',annualTarget:this.formBuilder.array(this.setAnnualTarget())})
    }, error =>{
      console.log(error);
    });
  }

  selectedMeasure:any;

  updateMeasure(objective:any,initiative:any,activity:any,measure:any){
    this.isUpdating = true;
    this.selectedMeasure = measure;
    this.measureForm.patchValue({      
      objectiveId:objective.objectiveId,
      initiativeId:initiative.initiativeId,
      activityId:activity.activityId,
      measure:measure.measure,
      frequency:measure.frequency,
      currentLevel:measure.currentLevelOfMeasure,
      direction:measure.direction,
      // annualTarget:measure.annualTarget
    });
    // this.measureForm.controls["annualTarget"].patchValue(measure.annualTarget);
  }

  deleteMeasure(measureId:any,measures:any[],index:any){
    if(confirm("Are you sure you want to delete this Measure?"))
    this.orgService.deleteMeasure(measureId).subscribe((res:any)=>{
      console.log(res);
      measures.splice(index,1);
    })
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