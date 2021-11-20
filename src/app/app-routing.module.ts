import { ProfissionalComponent } from './profissional/profissional.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';

import { AuthGuard } from './auth-guard/auth-guard';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { PaginaNaoEncontradaComponent } from './pagina-nao-encontrada/pagina-nao-encontrada.component';

const routes: Routes = [
  {
    path: 'cliente',
        loadChildren: () => import ('./cliente/cliente.module').then(mod=>mod.ClienteModule),
     canActivate: [AuthGuard],
     canLoad: [AuthGuard]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'home',
    component: HomeComponent,
     canActivate:[AuthGuard]
  },
  {
    path: 'produto',
    loadChildren: () => import ('./produto/produto.module').then(mod => mod.ProdutoModule),
    canActivate:[AuthGuard],
    canLoad: [AuthGuard]
  },
  {
    path: 'profissional',
    loadChildren: () => import ('./profissional/profissional.module').then(mod => mod.ProfissionalModule),
    canActivate:[AuthGuard],
    canLoad: [AuthGuard]
  },
  {
    path: 'servico',
      loadChildren: () => import('./servico/servico.module').then(mod => mod.ServicoModule),
      canActivate : [AuthGuard],
      canLoad : [AuthGuard]
  },
  {
    path: 'tipo-servico',
      loadChildren: () => import('./tipo-servico/tipo-servico.module').then(mod => mod.TipoServicoModule),
      canActivate:[AuthGuard],
      canLoad: [AuthGuard]

  },
  {
    path: 'tipo-produto',
      loadChildren: () => import('./tipo-produto/tipo-produto.module').then(mod => mod.TipoProdutoModule),
      canActivate:[AuthGuard],
      canLoad: [AuthGuard]

  },
  { path: '', redirectTo: '/home', pathMatch: 'full'},
  { path: '**', component: PaginaNaoEncontradaComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
