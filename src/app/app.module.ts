import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent }  from './app.component';
import { StorageService } from "./shared/storage.service";
import { AuthGuard } from "./shared/auth.gaurd";


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
		loadChildren : 'app/planner/planner.module#PlannerModule',
		canActivate:[AuthGuard]
	}
	];
@NgModule({
  imports:[ BrowserModule,RouterModule.forRoot(routes,{ useHash: true })],
	declarations: [ AppComponent ],
	providers:[StorageService, AuthGuard],
	bootstrap:    [ AppComponent ],
	exports:[]
})
export class AppModule { }
