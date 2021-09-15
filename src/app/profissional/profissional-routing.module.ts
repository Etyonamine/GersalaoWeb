import { ProfissionalFormComponent } from './profissional-form/profissional-form.component';
import { ProfissionalComponent } from './profissional.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ProfissionalResolveGuard } from './guard/profissional-resolver.guard';

const rotas: Routes = [
  {path:'', component: ProfissionalComponent}  ,
  {path:'profissional-novo',
        component:ProfissionalFormComponent},
  {path:':codigo',
        component:ProfissionalFormComponent,
      resolve:{
        profissional: ProfissionalResolveGuard
      }}
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(rotas)
  ],
  exports:[RouterModule]
})
export class ProfissionalRoutingModule { }
