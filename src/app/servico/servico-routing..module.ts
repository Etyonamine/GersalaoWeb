
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { ServicoComponent } from "./servico.component";
import { NgModule } from '@angular/core';
import { ServicoFormComponent } from './servico-form/servico-form.component';

const servicosRoutes: Routes = [
   {path:'', component: ServicoComponent},
   {path:'servico-novo',
     component:ServicoFormComponent},
  // {
  //     path:':codigo',
  //     component:ClienteFormComponent,
  //     resolve:{
  //       cliente: ClienteResolveGuard
  //     }
  // }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(servicosRoutes)
  ],
  exports:[
    RouterModule
  ]
})
export class ServicoRoutingModule { }
