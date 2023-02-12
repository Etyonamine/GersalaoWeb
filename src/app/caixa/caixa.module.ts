import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { CaixaAbrirComponent } from './caixa-abrir/caixa-abrir.component';
import { CaixaRoutingModule } from './caixa-routing.module';
import { CaixaComponent } from './caixa.component';

@NgModule({
  declarations: [    
    CaixaAbrirComponent, CaixaComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    CaixaRoutingModule
  ]
})
export class CaixaModule { }
