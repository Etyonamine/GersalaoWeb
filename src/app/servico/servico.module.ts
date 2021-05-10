import { ReactiveFormsModule } from '@angular/forms';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServicoComponent } from './servico.component';
import { ServicoRoutingModule } from './servico-routing..module';
import { MaterialModule } from './../material/material.module';
import { ServicoFormComponent } from './../servico/servico-form/servico-form.component';

@NgModule({

  declarations: [ServicoComponent,ServicoFormComponent],
  imports: [
    CommonModule,
    ServicoRoutingModule,
    ReactiveFormsModule,
    MaterialModule
  ],

})
export class ServicoModule { }
