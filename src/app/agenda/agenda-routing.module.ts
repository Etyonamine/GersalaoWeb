import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AgendaComponent } from './agenda.component';
import { AgendaFormComponent } from './agenda-form/agenda-form.component';
import { AgendaResolveGuard } from './guard/agenda-resolver.guard';
import { AgendaBaixaComponent } from './agenda-baixa/agenda-baixa.component';

const agendaRoutes: Routes = [
  {path:'', component: AgendaComponent},
  {path:'agenda-novo', component:AgendaFormComponent},  
  {path:':codigo', 
    component:AgendaBaixaComponent,
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
