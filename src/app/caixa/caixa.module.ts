import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { CaixaAbrirComponent } from './caixa-abrir/caixa-abrir.component';
import { CaixaComponent } from './caixa.component';
import { CaixaFecharComponent } from './caixa-fechar/caixa-fechar.component';
import { CaixaRoutingModule } from './caixa-routing.module';
@NgModule({
  declarations: [    
    CaixaAbrirComponent, CaixaComponent, CaixaFecharComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule ,
    CaixaRoutingModule   
  ]
})
export class CaixaModule { }
