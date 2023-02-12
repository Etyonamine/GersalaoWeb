import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CaixaComponent } from './caixa.component';
import { CaixaAbrirComponent } from './caixa-abrir/caixa-abrir.component';


const rotas: Routes = [
    {path:'caixa', component: CaixaComponent},
    {path:'abrir', component: CaixaAbrirComponent}
];

@NgModule({
    declarations: [],
    imports: [
      CommonModule,
      RouterModule.forChild(rotas)
    ],
    exports:[RouterModule]
  })
  export class CaixaRoutingModule { }