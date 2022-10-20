import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ResetSenhaComponent } from './reset-senha.component';

const rotas: Routes = [
    {path:'', component: ResetSenhaComponent}    
   
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
  