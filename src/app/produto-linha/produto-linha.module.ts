import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProdutoLinhaComponent } from './produto-linha.component';
import { ProdutoLinhaRoutingModule } from './produto-linha-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ProdutoLinhaEditDialogComponent } from './produto-linha-edit-dialog/produto-linha-edit-dialog.component';

@NgModule({
  declarations: [
    ProdutoLinhaComponent,
    ProdutoLinhaEditDialogComponent
  ],
  imports: [
    CommonModule, 
    FormsModule,
     ReactiveFormsModule,
    ProdutoLinhaRoutingModule, 
    SharedModule
  ]
})
export class ProdutoLinhaModule { }
