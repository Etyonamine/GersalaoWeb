import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ResetSenhaComponent } from './reset-senha.component';
import { ResetSenhaAlterarComponent } from './reset-senha-alterar/reset-senha-alterar.component';
import { ResetSenhaResolveGuard } from './guard/reset-senha-resolver.guard';

const rotas: Routes = [
    {path:'', component: ResetSenhaComponent},
    {
      path:':idGuid',
        component:ResetSenhaAlterarComponent,
        resolve:{
          idGuidEncontrado : ResetSenhaResolveGuard
        }           
    }   
  ];  
  @NgModule({
    declarations: [],
    imports: [
      CommonModule,
      RouterModule.forChild(rotas)
    ],
    exports:[RouterModule]
  })
  export class ResetSenhaRoutingModule { }
  