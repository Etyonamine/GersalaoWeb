import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClienteFinanceiroDetalheComponent } from '../cliente-financeiro-detalhe/cliente-financeiro-detalhe.component';
import { ClienteFinanceiroResolveGuard } from '../guard/cliente-financeiro.guard';
import { ClienteFinanceiroComponent } from './cliente-financeiro.component';

const routes: Routes = [
  {path:'', component: ClienteFinanceiroComponent},
  {path:'cliente-financeiro-detalhe/:codigo', component:ClienteFinanceiroDetalheComponent,
       resolve:{ codigo : ClienteFinanceiroResolveGuard}}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClienteFinanceiroRoutingModule { }
