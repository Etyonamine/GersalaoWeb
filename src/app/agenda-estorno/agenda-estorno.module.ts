import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgendaEstornoComponent } from './agenda-estorno.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    AgendaEstornoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class AgendaEstornoModule { }
