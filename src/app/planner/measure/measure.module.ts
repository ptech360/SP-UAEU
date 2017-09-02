import { NgModule } from '@angular/core';
import { MeasureComponent } from './measure';
import { RouterModule } from '@angular/router';
import { SharedModule } from "../../shared/shared.module";
import {TreeView} from "./tree-view";

@NgModule({
	imports: [SharedModule,RouterModule.forChild([{
	 path: '', component: MeasureComponent 
	 }])],
	providers:[],
	declarations : [MeasureComponent,TreeView],
	// exports: [RouterModule]
})
export class MeasureModule{
}