import { MaterialModule } from './material/material.module';
import { SituacaoModule } from './situacao/situacao/situacao.module';
import { SharedModule } from './shared/shared.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { DEFAULT_CURRENCY_CODE, NgModule } from '@angular/core';
import { LOCALE_ID } from '@angular/core';
import { ClienteModule } from './cliente/cliente.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavegacaoComponent } from './navegacao/navegacao.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { PaginaNaoEncontradaComponent } from './pagina-nao-encontrada/pagina-nao-encontrada.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TipoServicoModule } from './tipo-servico/tipo-servico.module';
import { ServicoModule } from './servico/servico.module';
import { ProfissionalModule } from './profissional/profissional.module';
import { RouterModule } from '@angular/router';
import { EnderecoModule } from './endereco/endereco.module';
import { UsuarioModule } from './usuario/usuario.module';
import { ContatoModule } from './contato/contato.module';
import { TipoContatoModule } from './tipo-contato/tipo-contato.module.module';
import { DocumentoModule } from './documento/documento.module';
import { FormaPagamentoModule } from './forma-pagamento/forma-pagamento.module';
import { TipoProdutoModule } from './tipo-produto/tipo-produto.module';
import { ProdutoModule } from './produto/produto.module';
import { ProdutoLinhaModule } from './produto-linha/produto-linha.module';
import { CompraModule } from './compra/compra.module';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { TwoDecimalNumberDirective } from './two-decimal-number.directive';
import { CompraDetalheModule } from './compra-detalhe/compra-detalhe.module';
import { EstoqueModule } from './estoque/estoque.module';
import { PedidoModule } from './pedido/pedido.module';
import { AgendaModule } from './agenda/agenda.module';
import { ProfissionalApuracaoModule } from './profissional-apuracao/profissional-apuracao.module';

import localePt from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';
import { FornecedorComponent } from './fornecedor/fornecedor.component';
import { AgendaServicosModule } from './agenda-servicos/agenda-servicos.module';

import { TokenInterceptor } from './auth-guard/interceptor/token.interceptor';
import { EmpresaModule } from './empresa/empresa.module';
import { ProfissionalApuracaoComponent } from './profissional-apuracao/profissional-apuracao.component';
import { ResetSenhaModule } from './reset-senha/reset-senha.module';
import { ReportsModule } from './reports/reports.module';
import { MotivoCancelamentoServicoModule} from './motivo-cancelamento-servico/motivo-cancelamento-servico.module';

registerLocaleData(localePt,'pt');

@NgModule({
  declarations: [
    AppComponent,
    NavegacaoComponent,
    LoginComponent,
    HomeComponent,
    PaginaNaoEncontradaComponent,
    TwoDecimalNumberDirective,        
    FornecedorComponent, ProfissionalApuracaoComponent
   ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ClienteModule,
    MaterialModule,
    SharedModule,
    TipoServicoModule,
    ServicoModule,
    SituacaoModule,
    ProfissionalModule,
    EnderecoModule,
    UsuarioModule,
    ContatoModule,
    TipoContatoModule, 
    TipoProdutoModule,
    ProdutoModule,
    DocumentoModule, 
    FormaPagamentoModule, 
    ProdutoLinhaModule,
    CompraModule,
    CompraDetalheModule,
    EstoqueModule,
    PedidoModule,
    AgendaModule,
    AgendaServicosModule,
    ProfissionalApuracaoModule,
    ResetSenhaModule    ,
    ReportsModule ,
    EmpresaModule,
    MotivoCancelamentoServicoModule
  ],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'pt-BR'},
    ,
    { provide: LOCALE_ID, useValue: 'pt' },
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'BRL' },      
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
