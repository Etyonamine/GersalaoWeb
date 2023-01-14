import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AgendaComponent } from './agenda.component';
import { AgendaFormComponent } from './agenda-form/agenda-form.component';
import { AgendaResolveGuard } from './guard/agenda-resolver.guard';

const agendaRoutes: Routes = [
  {path:'', component: AgendaComponent},
  {path:'agenda-novo', component: AgendaFormComponent},
  {path:'agenda-novo/:codigo', component: AgendaFormComponent,
    resolve:{
      agenda: AgendaResolveGuard
    }
  }  
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
