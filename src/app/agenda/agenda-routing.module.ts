import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AgendaComponent } from './agenda.component';
import { AgendaFormComponent } from './agenda-form/agenda-form.component';

const agendaRoutes: Routes = [
  {path:'', component: AgendaComponent },  
  {path:'agenda-novo', component:AgendaFormComponent} 
  
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(agendaRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AgendaRoutingModule { }
