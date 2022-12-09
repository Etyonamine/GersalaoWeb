import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { AgendaComponent } from './agenda.component';
import { AgendaRoutingModule } from './agenda-routing.module';
import { AgendaFormComponent } from './agenda-form/agenda-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgendaBaixaComponent } from './agenda-baixa/agenda-baixa.component';
import { AgendaAlertBaixaCancelamentoComponent } from './agenda-alert-baixa-cancelamento/agenda-alert-baixa-cancelamento.component';
import { AgendaCancelamentoComponent } from './agenda-cancelamento/agenda-cancelamento.component';

@NgModule({
  declarations: [
    AgendaComponent,
    AgendaFormComponent,
    AgendaBaixaComponent,
    AgendaAlertBaixaCancelamentoComponent,
    AgendaCancelamentoComponent
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
