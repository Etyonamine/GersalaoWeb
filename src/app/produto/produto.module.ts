import {DEFAULT_CURRENCY_CODE, LOCALE_ID,NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProdutoComponent } from './produto.component';
import { ProdutoRoutingModule } from './produto-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ProdutoEditComponent } from './produto-edit/produto-edit.component';

@NgModule({
  declarations: [
    ProdutoComponent,
    ProdutoEditComponent
  ],
  imports: [
    CommonModule, 
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ProdutoRoutingModule, 
     
  ],
  providers:[
    {provide: LOCALE_ID, useValue:'pt'},    
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'BRL' },
  ]
})
export class ProdutoModule { }
