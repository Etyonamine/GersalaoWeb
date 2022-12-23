import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReportsComponent } from './reports.component';



const rotas: Routes = [
  {path:'', component: ReportsComponent} 
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
