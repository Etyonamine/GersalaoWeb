import { MaterialModule } from './../material/material.module';
import { ProfissionalRoutingModule } from './profissional-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfissionalComponent } from './profissional.component';
import { SharedModule } from './../shared/shared.module';
import { ProfissionalFormComponent } from './profissional-form/profissional-form.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [ProfissionalComponent, ProfissionalFormComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ProfissionalRoutingModule,
    MaterialModule,
    SharedModule
  ]
})
export class ProfissionalModule { }
