import { ClienteResolveGuard } from './guard/cliente-resolver.guard';
import { ClienteComponent } from './cliente.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from "@angular/router";
import { ClienteFormComponent } from './cliente-form/cliente-form.component';


const clienteRoutes: Routes = [
  {path:'', component: ClienteComponent},
  {path:'cliente-novo', component:ClienteFormComponent},
  {
    path:':codigo',
    component:ClienteFormComponent,
    resolve:{
      cliente: ClienteResolveGuard
    }
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(clienteRoutes)
  ],
  exports:[
    RouterModule
  ]
})
export class ClienteRoutingModule { }
