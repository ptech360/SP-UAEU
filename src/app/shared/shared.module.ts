import {NgModule} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { CommonModule } from "@angular/common";
@NgModule({
  imports:[ReactiveFormsModule,CommonModule,FormsModule,HttpModule],
  declarations:[],
  providers:[],
  exports:[ReactiveFormsModule,CommonModule,FormsModule,HttpModule]
})
export class SharedModule{
  
}