import { NgModule } from '@angular/core';
import { GoalComponent } from './goal';
import { RouterModule } from '@angular/router';
import { SharedModule } from "../../shared/shared.module";

@NgModule({
	imports: [SharedModule,RouterModule.forChild([{
	 path: '', component: GoalComponent 
	 }])],
	providers:[],
	declarations : [GoalComponent],
	// exports: [RouterModule]
})
export class GoalModule{
}