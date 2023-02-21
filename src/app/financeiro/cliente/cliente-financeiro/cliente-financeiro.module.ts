import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { ClienteFinanceiroRoutingModule } from './cliente-financeiro-routing.module';
import { ClienteFinanceiroComponent } from './cliente-financeiro.component';


@NgModule({
  declarations: [
    ClienteFinanceiroComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule ,
    SharedModule,
    ClienteFinanceiroRoutingModule
    
  ]
})
export class ClienteFinanceiroModule { }
