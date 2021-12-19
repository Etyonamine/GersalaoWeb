import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnderecoComponent } from './endereco.component';
import { SharedModule } from './../shared/shared.module';
import { MaterialModule } from './../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
 
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
 

@NgModule({
  declarations: [
    EnderecoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule ,
    MaterialModule
  ],
  providers: [
     
  ],
})
export class EnderecoModule { }
