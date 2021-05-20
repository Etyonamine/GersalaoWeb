import { ProfissionalRoutingModule } from './profissional-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfissionalComponent } from './profissional.component';

@NgModule({
  declarations: [ProfissionalComponent],
  imports: [
    CommonModule,
    ProfissionalRoutingModule
  ]
})
export class ProfissionalModule { }
