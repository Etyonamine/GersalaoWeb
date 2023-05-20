import { NgModule } from '@angular/core';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReportsComponent } from './reports.component';
import { ReportsRoutingModule } from './reports-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ClienteReportComponent } from './cliente-report/cliente-report.component';
import { ProfissionalReportComponent } from './profissional-report/profissional-report.component';
import { ServicoReportComponent } from './servico-report/servico-report.component';
import { AgendaReportComponent } from './agenda-report/agenda-report.component';
@NgModule({
  declarations: [ReportsComponent, ClienteReportComponent, ProfissionalReportComponent, ServicoReportComponent, AgendaReportComponent],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ReportsRoutingModule,
    SharedModule
  ]
})
export class ReportsModule { }
