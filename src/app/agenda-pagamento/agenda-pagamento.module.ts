import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgendaPagamentoComponent } from './agenda-pagamento.component';
import { AgendaPagamentoDetalheComponent } from './agenda-pagamento-detalhe/agenda-pagamento-detalhe.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
@NgModule({
  declarations: [
    AgendaPagamentoComponent,
    AgendaPagamentoDetalheComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class AgendaPagamentoModule { }
