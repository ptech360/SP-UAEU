import { NgModule } from '@angular/core';
import { InitiativeComponent } from './initiative';
import { RouterModule } from '@angular/router';
import { SharedModule } from "../../shared/shared.module";

@NgModule({
	imports: [SharedModule,RouterModule.forChild([{
	 path: '', component: InitiativeComponent 
	 }])],
	providers:[],
	declarations : [InitiativeComponent],
	// exports: [RouterModule]
})
export class InitiativeModule{
}