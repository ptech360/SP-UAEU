import { Component } from '@angular/core';
import { StorageService } from '../shared/storage.service';
import { UniversityService } from "../shared/UTI.service";
import { Router } from "@angular/router";
@Component({
	selector:'app-planner',
	templateUrl : './planner.component.html',
	styleUrls:['./planner.component.css']
}) 
export class PlannerComponent{ 
	constructor(public stogareService:StorageService, 
							public utiService:UniversityService,
							public router:Router){
		this.fetchOrganizationInfo();
		// this.router.navigateByUrl("/planner/home");
	}

	public fetchOrganizationInfo() {
    this.utiService.fetchOrganizationInfo().subscribe((res:any) => {
			this.stogareService.storeData("org_info", res); 			
    }, (err:any) => {

    });
	}
	
	logout(){
		localStorage.clear();
	}

}	
