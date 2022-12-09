import { UsuarioResolveGuard } from './guard/usuario-resolver.guard';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsuarioComponent } from './usuario.component';
import { UsuarioAlterarSenhaComponent } from './usuario-alterar-senha/usuario-alterar-senha.component';

const routes: Routes = [
  {
    path:'', component: UsuarioComponent
  },
  {
    path:'usuario-alterar-senha',component:UsuarioAlterarSenhaComponent
    },
    {
    path:':login',
    component:UsuarioAlterarSenhaComponent,
    resolve:{
      usuario: UsuarioResolveGuard
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
export class UsuarioRoutingModule{}
