import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from "../../shared/shared.module";

@NgModule({
	imports: [SharedModule,RouterModule.forChild([{
	 path: '', component: HomeComponent 
	 }])],
	providers:[],
	declarations : [HomeComponent],
	// exports: [RouterModule]
})
export class HomeModule{
}