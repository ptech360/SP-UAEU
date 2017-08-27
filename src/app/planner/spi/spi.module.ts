import { NgModule } from '@angular/core';
import { SPIComponent } from './spi.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from "../../shared/shared.module";

@NgModule({
	imports: [SharedModule,RouterModule.forChild([{
	 path: '', component: SPIComponent 
	 }])],
	providers:[],
	declarations : [SPIComponent],
	// exports: [RouterModule]
})
export class SPIModule{
}