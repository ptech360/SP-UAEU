import {Component} from '@angular/core';
import { UniversityService } from "../../shared/UTI.service";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { StorageService } from "../../shared/storage.service";
@Component({
  selector:'initiatives',
  templateUrl:'./initiative.html',
  styleUrls:['./initiative.css','./../planner.component.css']
})
export class InitiativeComponent{
  public goals:any[];
  public objectives:any[];
  public initiativeForm: FormGroup;
  public quarter:any[] = ["Q1","Q2","Q3","Q4"];
  constructor(public orgService:UniversityService, 
              public formBuilder: FormBuilder,
              public commonService:StorageService){
              this.orgService.getObjectives().subscribe((response:any)=>{
                this.objectives = response;
              });
              this.getInitiative();
              this.initiativeForm = this.initForm();
  }

  getInitiative(){
    this.orgService.getInitiatives().subscribe((response:any)=>{
      this.goals = response;
    });
  }

  initForm(){
    return this.formBuilder.group({
      "objectiveId":['',[Validators.required]],
      "initiative": ['', [Validators.required]],
      // "totalCost": ['', [Validators.required]],
      // "activities": this.formBuilder.array([this.setActivity()])
    });
  }
  setActivity() {
    return this.formBuilder.group({
      "activity": ['', [Validators.required]],
      "measures": this.formBuilder.array([this.setMeasure()])
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

  addActivity(form:any) {
    const control = <FormArray>form.controls['activities'];
    control.push(this.setActivity());
  }
  removeActivity(form:any, i:any) {
    const control = <FormArray>form.controls['activities'];
    control.removeAt(i);
  }
  addMeasure(form:any) {
    const control = <FormArray>form.controls['measures'];
    control.push(this.setMeasure());
  }
  removeMeasure(form:any, j:any) {
    const control = <FormArray>form.controls['measures'];
    control.removeAt(j);
  }

  setTargetTable(form:any, e:any) {
    for (var index = 0; index < this.commonService.getData('org_info').cycle.length; index++) {
      form[index].controls['levels'] = this.formBuilder.array([]);
      const levels = <FormArray>form[index].controls['levels'];
      for (var i = 0; i < e; i++) {
        levels.push(this.inItLevels(this.quarter[i]));
      }
    }
  }

  selectedObjective:any;
  submitInitiative() {
    // this.initiativeForm.value['objectiveId'] = this.selectedObjective.id;
    this.orgService.addInitiative(this.initiativeForm.value).subscribe((res:any) => {
      this.getInitiative();
      // $('#initiativeModal').modal('hide');
      this.initForm();
    }, err => {
      console.log(err);
    });
  }
}