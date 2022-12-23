import { MaterialModule } from './../material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClienteComponent } from './cliente.component';
import { ClienteRoutingModule } from './cliente-routing.module';
import { ClienteFormComponent } from './cliente-form/cliente-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from './../shared/shared.module';
import { ClienteService } from './cliente.service';
import { ClienteFormaPagamentoComponent } from './cliente-forma-pagamento/cliente-forma-pagamento.component';
import { ClienteformapagamentodialogoComponent } from './cliente-forma-pagamento/clienteformapagamentodialogo/clienteformapagamentodialogo.component';




@NgModule({
  declarations: [
    ClienteComponent,
    ClienteFormComponent,
    ClienteFormaPagamentoComponent,
    ClienteformapagamentodialogoComponent
  ],
  imports: [
    CommonModule ,
    ClienteRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule


  ],
  providers:[
    ClienteService

  ]


})
export class ClienteModule { }
