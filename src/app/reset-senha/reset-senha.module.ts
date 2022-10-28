import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResetSenhaRoutingModule } from './reset-senha-routing.module';
import { ResetSenhaComponent } from './reset-senha.component';
import { SharedModule } from './../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ResetSenhaAlterarComponent } from './reset-senha-alterar/reset-senha-alterar.component';
@NgModule({
  declarations: [
    ResetSenhaComponent,
    ResetSenhaAlterarComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ResetSenhaRoutingModule,
    SharedModule
  ]
})
export class ResetSenhaModule { }
