import { NgModule } from '@angular/core';
import { ActivityComponent } from './activity';
import { RouterModule } from '@angular/router';
import { SharedModule } from "../../shared/shared.module";

@NgModule({
	imports: [SharedModule,RouterModule.forChild([{
	 path: '', component: ActivityComponent 
	 }])],
	providers:[],
	declarations : [ActivityComponent],
	// exports: [RouterModule]
})
export class ActivityModule{
}