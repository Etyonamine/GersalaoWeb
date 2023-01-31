import { DEFAULT_CURRENCY_CODE, LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfissionalApuracaoRoutingModule } from './profissional-apuracao-routing.module';
import { ProfissionalApuracaoFormComponent } from './profissional-apuracao-form/profissional-apuracao-form.component';
import { SharedModule } from '../shared/shared.module';
import { ProfissionalApuracaoDetalheComponent } from './profissional-apuracao-detalhe/profissional-apuracao-detalhe.component';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { ProfissionalApuracaoPagamentoComponent } from './profissional-apuracao-pagamento/profissional-apuracao-pagamento.component';


@NgModule({
  declarations: [
    ProfissionalApuracaoFormComponent,
    ProfissionalApuracaoDetalheComponent,
    ProfissionalApuracaoPagamentoComponent  
  ],
  imports: [
    CommonModule,
    FormsModule, 
    ReactiveFormsModule ,
    SharedModule,
    ProfissionalApuracaoRoutingModule 
  ],
  providers:[
    {provide: MAT_DATE_LOCALE, useValue: 'pt-BR'},
    ,
    { provide: LOCALE_ID, useValue: 'pt' },
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'BRL' },   
  ]
})
export class ProfissionalApuracaoModule { }
