import { Component } from '@angular/core';
import { UniversityService } from "../../shared/UTI.service";
import { FormBuilder, Validators, FormGroup, FormArray } from "@angular/forms";
import { StorageService } from "../../shared/storage.service";
@Component({
  selector: 'spi',
  templateUrl: './spi.component.html',
  styleUrls: ['./../planner.component.css']
})
export class SPIComponent {
  public spis: any[];
  public objectives: any[];
  public spiForm: FormGroup;
  constructor(public orgService: UniversityService,
    public formBuilder: FormBuilder,
    public commonService: StorageService) {
    this.orgService.getObjectives().subscribe((response: any) => {
      this.objectives = response;
    });

    this.getSpis();
    this.spiForm = this.inItSpi();
  }

  getSpis(){
    this.orgService.getSpis().subscribe((res: any) => {
      this.spis = res;
    });
  }

  inItSpi() {
    return this.formBuilder.group({
      "objectiveId":['', [Validators.required]],
      "spi": ['', [Validators.required]],
      "measureUnit": ['', [Validators.required]],
      "currentLevel": ['', [Validators.required]],
      "frequencyId": [1],
      "targetDigital": this.formBuilder.array(this.inItTarget())
    });
  }
  inItTarget() {
    const fa: any[] = [];
    this.commonService.getData('org_info').cycle.forEach((element: any) => {
      fa.push(this.inItTargetDigital(element));
    });
    return fa;
  }

  inItTargetDigital(year: any) {
    return this.formBuilder.group({
      "year": [year, [Validators.required]],
      "expectedLevel": ['', [Validators.required]],
    });
  }

  onSubmit(){
    this.orgService.saveSpi(this.spiForm.value).subscribe((res:any)=>{
      this.spiForm.reset();
      this.getSpis();
    })
  }
}