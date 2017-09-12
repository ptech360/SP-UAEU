import { NgModule } from '@angular/core';
import { PlanComponent } from './plan';
import { RouterModule } from '@angular/router';
import { SharedModule } from "../../shared/shared.module";

@NgModule({
	imports: [SharedModule,RouterModule.forChild([{
	 path: '', component: PlanComponent 
	 }])],
	providers:[],
	declarations : [PlanComponent],
	// exports: [RouterModule]
})
export class PlanModule{
}