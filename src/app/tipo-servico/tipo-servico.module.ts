import { SharedModule } from './../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './../material/material.module';
import { TipoServicoComponent } from './tipo-servico.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import{ TipoServicoRoutingModule} from './tipo-servico-routing.module';
import { TipoServicoFormComponent } from './tipo-servico-form/tipo-servico-form.component';

@NgModule({
  declarations: [TipoServicoComponent, TipoServicoFormComponent],
  imports: [
    CommonModule,
    MaterialModule,
    TipoServicoRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class TipoServicoModule { }
