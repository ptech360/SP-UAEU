import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent }  from './app.component';
import { StorageService } from "./shared/storage.service";


export const routes: Routes = [
	{
		path: '',
		redirectTo: 'login',
		pathMatch : 'full' 
	},
	{
		path : 'login',
		loadChildren : 'app/login/login.module#LoginModule'
	},
	{
		path : 'planner',
		loadChildren : 'app/planner/planner.module#PlannerModule'
	}
	];
@NgModule({
  imports:[ BrowserModule,RouterModule.forRoot(routes)],
	declarations: [ AppComponent ],
	providers:[StorageService],
	bootstrap:    [ AppComponent ],
	exports:[]
})
export class AppModule { }
