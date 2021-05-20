import { ProfissionalComponent } from './profissional.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';



const servicosRoutes: Routes = [
  {path:'', component: ProfissionalComponent}
  // ,
  // {path:'servico-novo',
  //   component:ProfissionalComponent}
//     ,
//  {
//      path:':codigo',
//      component:ServicoFormComponent,
//      resolve:{
//        servico: ServicoResolveGuard
//      }
//  }
];
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(servicosRoutes)
  ]
})
export class ProfissionalRoutingModule { }
