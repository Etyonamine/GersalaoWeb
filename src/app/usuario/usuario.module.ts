import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioComponent } from './usuario.component';
import { UsuarioAlterarSenhaComponent } from './usuario-alterar-senha/usuario-alterar-senha.component';
import { UsuarioRoutingModule }  from './usuario-routing.module';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [UsuarioComponent, UsuarioAlterarSenhaComponent],
  imports: [
    CommonModule,
    MaterialModule,    
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    UsuarioRoutingModule
  ]
})
export class UsuarioModule { }
