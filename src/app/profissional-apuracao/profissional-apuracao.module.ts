import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfissionalApuracaoRoutingModule } from './profissional-apuracao-routing.module';
import { ProfissionalApuracaoFormComponent } from './profissional-apuracao-form/profissional-apuracao-form.component';
import { SharedModule } from '../shared/shared.module';
@NgModule({
  declarations: [
    ProfissionalApuracaoFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule, 
    ReactiveFormsModule ,
    SharedModule,
    ProfissionalApuracaoRoutingModule 
  ]
})
export class ProfissionalApuracaoModule { }
