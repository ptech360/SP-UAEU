import {Component} from '@angular/core';
import { UniversityService } from "../../shared/UTI.service";
import { FormBuilder, Validators, FormGroup, FormArray } from "@angular/forms";
import { StorageService } from "../../shared/storage.service";

declare let $:any;

@Component({
  selector:'strategic-goal',
  templateUrl:'./goal.html',
  styleUrls:['./goal.css','./../planner.component.css']
})

export class GoalComponent{
  public objectiveForm: FormGroup;
  public isUpdating:boolean = false;
  public goals:any[];
  public goalsCopy:any[];
  // public searchForm:FormGroup;

  constructor(public orgService:UniversityService,
              public formBuilder: FormBuilder,
              public commonService:StorageService){
                // this.searchForm = this.formBuilder.group({
                //   "search":['',[Validators.required]]
                // })
              this.initObjectiveForm();
              this.getGoals();
  }
  emptySearchResult:any;
  searchGoal(key:any){
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

  getGoals(){
    this.orgService.getObjectives().subscribe((response:any)=>{
      this.goals = response;
      this.goalsCopy = response;
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

  onSubmit() {
    this.objectiveForm.value["cycleId"] = this.commonService.getData('org_info').cycles.id;
    if(!this.isUpdating){
      this.orgService.addObjective(this.objectiveForm.value).subscribe((response:any) => {
        $('#objectModal').modal('show');
        // this.returnedObject = response;
        // this.goals.push(this.returnedObject);
        this.initObjectiveForm();
        this.getGoals();
      }, (error:any) => {
        console.log(error);
      });
    }
    
    if(this.isUpdating){
      if(confirm("Are you sure you want to Update this Goal?"))
      this.orgService.updateObjective(this.selectedObjective.objectiveId,this.objectiveForm.value).subscribe((res:any)=>{
        console.log(res);
        $('#objectModal').modal('show');
        this.objectiveForm.reset();
        this.getGoals();
        this.isUpdating=false;
      })
    }
    
  }
  deleteGoal(objectiveId:any,objectives:any[],index:any){
    if(confirm("Are you sure you want to delete this Goal?"))
    this.orgService.deleteObjective(objectiveId).subscribe((res:any)=>{
      console.log(res);
      objectives.splice(index,1);
    })
  }
  selectedObjective:any;
  updateGoal(goal:any){
    this.selectedObjective = goal;
    this.isUpdating=true;
    this.objectiveForm.controls["objective"].patchValue(goal.objective);
  }
}
