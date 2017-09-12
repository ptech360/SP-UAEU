import {Component} from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { StorageService } from "../../shared/storage.service";
import { UniversityService } from "../../shared/UTI.service";
@Component({
  selector:'strategic-plan',
  templateUrl:'./plan.html',
  styleUrls:['./../planner.component.css']
})
export class PlanComponent{
  title:string = "Strategic Plan";
  cycleForm:FormGroup;
  cycles:any[]=[];
  constructor(public ss:StorageService,public orgService:UniversityService){
    this.cycleForm = new FormGroup({
      "universityId":new FormControl(this.ss.getData('org_info').universityId),
      "description":new FormControl('',[Validators.required]),
      "planYear":new FormControl('',[Validators.required]),
      "startYear":new FormControl('',[Validators.required]),
      "endYear":new FormControl('',[Validators.required]),
      "active":new FormControl('',[Validators.required])
    });  
    this.getCycles();
  }

  getCycles(){
    this.orgService.getCycles().subscribe((response:any)=>{
      if(response.status == 204){
        this.cycles = [];
      }else{
        this.cycles = response;
        console.log(this.cycles);
      }
    }) 
  }

  onSubmit(){
    this.orgService.saveCycle(this.cycleForm.value).subscribe((response:any)=>{
      this.getCycles();
    })
  }

  deleteCycle(cycleId:any){
    this.orgService.deleteCycle(cycleId).subscribe((response:any)=>{
      this.getCycles();
    })
  }
}