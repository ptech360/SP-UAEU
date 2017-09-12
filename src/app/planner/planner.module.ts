import { NgModule } from '@angular/core';
import { PlannerComponent } from './planner.component';
import { RouterModule } from '@angular/router';
import { PlannerService } from "./planner.service";
import { UniversityService } from "../shared/UTI.service";
import { StorageService } from "../shared/storage.service";
import { CustomHttpService } from "../shared/default.header.service";
import { SharedModule } from "../shared/shared.module";
@NgModule({
	imports: [SharedModule,RouterModule.forChild([
		{
			path: '',
			component: PlannerComponent,
			children: [
				{
					path: 'home',
					loadChildren: 'app/planner/home/home.module#HomeModule'
				},
				{ path: 'strategic-plan', loadChildren: 'app/planner/plan/plan.module#PlanModule'},
				{ path: 'strategic-goal', loadChildren: 'app/planner/goal/goal.module#GoalModule'},
				{ path: 'initiatives', loadChildren: 'app/planner/initiative/initiative.module#InitiativeModule'},
				{ path: 'activities', loadChildren: 'app/planner/activity/activity.module#ActivityModule'},
				{ path: 'measures', loadChildren: 'app/planner/measure/measure.module#MeasureModule'}, 
				{ path: 'spi', loadChildren:'app/planner/spi/spi.module#SPIModule'}
			]
		},

	])],
	providers: [PlannerService, UniversityService, StorageService, CustomHttpService],
	declarations: [PlannerComponent],
	// exports: [RouterModule]
})
export class PlannerModule {
}