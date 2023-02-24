import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { AgendaComponent } from './agenda.component';
import { AgendaRoutingModule } from './agenda-routing.module';
import { AgendaFormComponent } from './agenda-form/agenda-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgendaCancelamentoComponent } from './agenda-cancelamento/agenda-cancelamento.component';
import { AgendaConsultaComponent } from './agenda-consulta/agenda-consulta.component';
@NgModule({
  declarations: [
    AgendaComponent,
    AgendaFormComponent,    
    AgendaCancelamentoComponent,
    AgendaConsultaComponent
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
