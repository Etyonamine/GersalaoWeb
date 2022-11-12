import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmpresaComponent } from './empresa.component';
import { RouterModule, Routes} from  "@angular/router";

const routes: Routes = [
  {path:'', component: EmpresaComponent},  
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports:[
    RouterModule
  ]
})
export class EmpresaRoutingModule { }
