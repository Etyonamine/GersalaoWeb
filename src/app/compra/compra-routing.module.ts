import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CompraComponent } from './compra.component';
import { CompraResolveGuard } from './guard/compra-resolver.guard';
import { CompraEditComponent } from './compra-edit/compra-edit.component';

const comprasRoutes: Routes = [
  {path:'', component: CompraComponent},
  {path:'compra-novo',component:CompraEditComponent},
  {path:':codigo',component:CompraEditComponent,
        resolve:{
          compra: CompraResolveGuard
        }
  }    
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(comprasRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class CompraRoutingModule { }
