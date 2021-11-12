import { MaterialModule } from './material/material.module';
import { SituacaoModule } from './situacao/situacao/situacao.module';
import { SharedModule } from './shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
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



@NgModule({
  declarations: [
    AppComponent,
    NavegacaoComponent,
    LoginComponent,
    HomeComponent,
    PaginaNaoEncontradaComponent
    
   
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
    DocumentoModule, 
    FormaPagamentoModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
