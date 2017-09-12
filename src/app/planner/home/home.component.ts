import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { StorageService } from "../../shared/storage.service";
import { UniversityService } from "../../shared/UTI.service";

declare let $:any;

@Component({
  selector:'planner-home',
  templateUrl:'./home.component.html'
})
export class HomeComponent implements OnInit {
  public valueForm:FormGroup;
  public missionVisionForm:FormGroup;
  public missionVision:string;
  public organizationInfo:any;
  public selectedValue:any;

  constructor(public commonService: StorageService,public orgSer:UniversityService) {
    this.valueForm = new FormGroup({
      title:new FormControl('',[Validators.required]),
      description:new FormControl('',Validators.required),
    });
    this.missionVisionForm = new FormGroup({
      description:new FormControl('',Validators.required)
    });
   }

  ngOnInit() {
    this.organizationInfo = this.commonService.getData('org_info');    
  }

  onValueSubmit(){
    if(this.selectedValue){
      this.orgSer.updateValue(this.valueForm.value,this.selectedValue.valueId)
      .subscribe((res:any)=>{
        this.valueForm.value["id"] = this.selectedValue.valueId;
        this.organizationInfo.values[this.selectedValueIndex] = this.valueForm.value;
        this.commonService.storeData('org_info',this.organizationInfo);
        $('#valueForm').modal('hide');
        this.valueForm.reset();
      })
    }else{
      this.valueForm.value["universityId"] = this.organizationInfo.universityId;
      this.orgSer.addValue([this.valueForm.value]).subscribe((res:any)=>{
        this.organizationInfo.values.push(this.valueForm.value);
        $('#valueForm').modal('hide');
        this.valueForm.reset();
      })
    }    
  }

  deleteValue(val:any,index:any){
    console.log("asddfadsfdsfds adsf ");
    this.orgSer.deleteValue(val.valueId).subscribe((res:any)=>{
      this.organizationInfo.values.splice(index,1);
    })
  }
  selectedValueIndex:any;
  onValueSelected(val:any,index:any){
    this.valueForm.controls["title"].patchValue(val.title);
    this.valueForm.controls["description"].patchValue(val.description);
    this.selectedValue = val;
    this.selectedValueIndex = index;
  }

  editMisionVision(title:any, mvDesc:any){
    this.missionVision = title;
    this.missionVisionForm.controls["description"].patchValue(mvDesc);
  }

  onMissionVisionSubmit(){
    var org_info:any = this.commonService.getData('org_info');
    var object:any ={};
    object[this.missionVision] = this.missionVisionForm.value['description'];
    console.log(object);
    this.orgSer.updateMisionVision(object).subscribe(res=>{      
      this.organizationInfo[this.missionVision] = this.missionVisionForm.value['description'];
      org_info[this.missionVision] = this.missionVisionForm.value['description'];
      this.commonService.storeData('org_info',org_info);
      $('#missionVisionForm').modal('hide');
    })
  }
}