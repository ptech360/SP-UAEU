import {Component} from '@angular/core';
import { UniversityService } from "../../shared/UTI.service";
import { FormBuilder, Validators, FormGroup, FormArray } from "@angular/forms";
import { StorageService } from "../../shared/storage.service";



@Component({
  selector:'strategic-goal',
  templateUrl:'./goal.html',
  styleUrls:['./goal.css','./../planner.component.css']
})

export class GoalComponent{
  public objectiveForm: FormGroup;

  public goals:any[];

  constructor(public orgService:UniversityService,
              public formBuilder: FormBuilder,
              public commonService:StorageService){
              this.initObjectiveForm();
    this.orgService.getObjectives().subscribe((response:any)=>{
      this.goals = response;
    })
  }

  initObjectiveForm() {
    this.objectiveForm = this.formBuilder.group({
      "objective": ['', [Validators.required]],
      // "totalCost": ['', [Validators.required]],
      // "spis": this.formBuilder.array([this.inItSpi()]),
    });
  }
  inItSpi() {
    return this.formBuilder.group({
      "spi": ['', [Validators.required]],
      "measureUnit": ['', [Validators.required]],
      "currentLevel": ['', [Validators.required]],
      "frequencyId":[1],
      "targetDigital": this.formBuilder.array(this.inItTarget())
    });
  }  
  inItTarget() {
    const fa:any[] = [];
    this.commonService.getData('org_info').cycle.forEach((element:any) => {
      fa.push(this.inItTargetDigital(element));
    });
    return fa;
  }

  inItTargetDigital(year:any) {
    return this.formBuilder.group({
      "year": [year, [Validators.required]],
      "expectedLevel": ['', [Validators.required]],
    });
  }

  addSpi(form:any) {
    const control = <FormArray>form.controls['spis'];
    control.push(this.inItSpi());
  }

  removeSpi(form:any, index:any) {
    const control = <FormArray>form.controls['spis'];
    control.removeAt(index);
  }

  returnedObject:any;
  onSubmit() {
    this.objectiveForm.value["cycleId"] = this.commonService.getData('org_info').cycles.id;
    this.orgService.addObjective(this.objectiveForm.value).subscribe((response:any) => {
      // $('#objectiveModal').modal('hide');
      this.returnedObject = response;
      this.goals.push(this.returnedObject);
      this.initObjectiveForm();
    }, (error:any) => {
      console.log(error);
    });
  }
}