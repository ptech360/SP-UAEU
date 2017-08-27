import { NgModule } from '@angular/core';
import { LoginComponent } from './login.component';
import { RouterModule } from '@angular/router';
import { CredentialService } from './login.service';
import { SharedModule } from "../shared/shared.module";
@NgModule({
	imports: [SharedModule,RouterModule.forChild([{
	 path: '', component: LoginComponent 
	 }])],
	declarations : [LoginComponent],
	// exports: [RouterModule],
	providers:[CredentialService]
})
export class LoginModule { }