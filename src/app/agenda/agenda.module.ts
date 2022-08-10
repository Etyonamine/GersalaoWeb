import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { AgendaComponent } from './agenda.component';
import { AgendaRoutingModule } from './agenda-routing.module';
import { AgendaFormComponent } from './agenda-form/agenda-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgendaBaixaComponent } from './agenda-baixa/agenda-baixa.component';

@NgModule({
  declarations: [
    AgendaComponent,
    AgendaFormComponent,
    AgendaBaixaComponent
  ],
  imports: [
    CommonModule,
    AgendaRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AgendaModule { }
