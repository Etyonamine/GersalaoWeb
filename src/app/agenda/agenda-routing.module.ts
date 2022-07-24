import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AgendaComponent } from './agenda.component';

const agendaRoutes: Routes = [
  {path:'', component: AgendaComponent},
  /* {path:'agenda-novo',
      component:CompraEditComponent},
      {
        path:':codigo',
        component:CompraEditComponent,
        resolve:{
          compra: CompraResolveGuard
      }
  } */
    
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
