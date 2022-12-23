import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { CompraComponent } from './compra.component';
import { SharedModule } from '../shared/shared.module';
import { CompraRoutingModule } from './compra-routing.module';
import { CompraEditComponent } from './compra-edit/compra-edit.component';
import { CompraBaixaPagtoComponent } from './compra-baixa-pagto/compra-baixa-pagto.component';


@NgModule({
  declarations: [
    CompraComponent,
    CompraEditComponent,
    CompraBaixaPagtoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    CompraRoutingModule
  ]
})
export class CompraModule { }
