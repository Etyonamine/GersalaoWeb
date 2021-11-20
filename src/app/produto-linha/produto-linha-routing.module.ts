import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ProdutoLinhaComponent } from './produto-linha.component';


const routes: Routes = [
  {
    path:'', component: ProdutoLinhaComponent
  }
];
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports:[
    RouterModule
  ]
})
export class ProdutoLinhaRoutingModule { }
