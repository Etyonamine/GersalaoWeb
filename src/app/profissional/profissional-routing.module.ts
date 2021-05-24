import { ProfissionalFormComponent } from './profissional-form/profissional-form.component';
import { ProfissionalComponent } from './profissional.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';



const rotas: Routes = [
  {path:'', component: ProfissionalComponent}  ,
  {path:'profissional-novo',    component:ProfissionalFormComponent}
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
