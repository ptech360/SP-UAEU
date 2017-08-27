import { NgModule } from '@angular/core';
import { MeasureComponent } from './measure';
import { RouterModule } from '@angular/router';
import { SharedModule } from "../../shared/shared.module";

@NgModule({
	imports: [SharedModule,RouterModule.forChild([{
	 path: '', component: MeasureComponent 
	 }])],
	providers:[],
	declarations : [MeasureComponent],
	// exports: [RouterModule]
})
export class MeasureModule{
}