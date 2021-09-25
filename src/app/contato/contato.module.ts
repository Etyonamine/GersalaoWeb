import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContatoFormComponent } from './contato-form/contato-form.component';
import { MaterialModule } from '../material/material.module';
import { SharedModule } from './../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    ContatoFormComponent
  ],
  imports: [
    CommonModule, 
    MaterialModule,
    SharedModule , 
    FormsModule,
    ReactiveFormsModule
     
  ]
})
export class ContatoModule { }
