import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReportsComponent } from './reports.component';
import { ClienteReportComponent } from './cliente-report/cliente-report.component';



const rotas: Routes = [
  {path:'', component: ReportsComponent}, 
  {path:'cliente-report', component: ClienteReportComponent} 
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(rotas)
  ],
  exports:[RouterModule]
})
export class ReportsRoutingModule { }
