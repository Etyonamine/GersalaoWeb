import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ProfissionalApuracaoComponent } from './profissional-apuracao.component';
import { ProfissionalApuracaoFormComponent } from './profissional-apuracao-form/profissional-apuracao-form.component';


const rotas: Routes = [
  {path:'', component: ProfissionalApuracaoComponent}  , 
  {path:'apuracao-novo', component: ProfissionalApuracaoFormComponent}
  /* {path:'profissional-apuracao-novo',
        component:ProfissionalFormComponent},  
  {path:':codigo',
        component:ProfissionalFormComponent,
     resolve:{
        profissional: ProfissionalResolveGuard
      }} */
 
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(rotas)
  ],
  exports:[RouterModule]
})
export class ProfissionalApuracaoRoutingModule { }
