import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { EstoqueComponent } from './estoque.component';
import { EstoqueDetalheComponent } from './estoque-detalhe/estoque-detalhe.component';
import { EstoqueResolveGuard } from './guard/estoque-resolver.guard';


const estoqueRoutes: Routes = [
  {path:'', component: EstoqueComponent},
  {path:'estoque-detalhe',
      component:EstoqueDetalheComponent},
      {
        path:':codigoProduto/:dataEntrada',
        component:EstoqueDetalheComponent,
        resolve:{
          estoques: EstoqueResolveGuard
      }
  }
    
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(estoqueRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class EstoqueRoutingModule { }
