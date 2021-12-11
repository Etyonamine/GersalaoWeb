import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { CompraComponent } from './compra.component';
import { SharedModule } from '../shared/shared.module';
import { CompraRoutingModule } from './compra-routing.module';

@NgModule({
  declarations: [
    CompraComponent
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
