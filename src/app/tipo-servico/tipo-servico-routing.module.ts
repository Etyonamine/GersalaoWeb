import { TipoServicoResolveGuard } from './guard/tipo-servico-resolver.guard';
import { TipoServicoFormComponent } from './tipo-servico-form/tipo-servico-form.component';
import { TipoServicoComponent } from './tipo-servico.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path:'', component: TipoServicoComponent
  },
  {
    path:'tipo-servico-novo',component:TipoServicoFormComponent
  },
  {
    path:':codigo',
    component:TipoServicoFormComponent,
    resolve:{
      tipoServico: TipoServicoResolveGuard
    }
  }
];


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports:[
    RouterModule
  ]
})
export class TipoServicoRoutingModule{}
