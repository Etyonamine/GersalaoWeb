import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CaixaAbrirComponent } from './caixa-abrir/caixa-abrir.component';
import { CaixaFecharComponent } from './caixa-fechar/caixa-fechar.component';
import { CaixaComponent } from './caixa.component';
import { CaixaResolveGuard } from './guard/caixa-resolver.guard';

const routes: Routes = [
  {path:'',component:CaixaComponent},
  {path:'abrir', component:CaixaAbrirComponent},
  {path:'caixa/:codigo', component:CaixaFecharComponent,
    resolve:{
      caixa: CaixaResolveGuard
    }}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CaixaRoutingModule { }
