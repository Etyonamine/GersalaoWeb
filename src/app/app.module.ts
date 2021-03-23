import { EnderecoServiceService } from './endereco/endereco-service.service';
import { ClienteEnderecoService } from './cliente-endereco.service';
import { ClienteEndereco } from './cliente-endereco/cliente-endereco';
import { UnidadeFederativaService } from './unidade-federativa/unidade-federativa-service';

import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule} from './app-routing.module';

import { AppComponent } from './app.component';
import { BaseFormComponent } from './base.form.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FlexLayoutModule} from '@angular/flex-layout';
import { FormsModule,FormControl, ReactiveFormsModule} from '@angular/forms';
import { MaterialModule } from './core/material.module';

import { HomeComponent } from './home/home.component';
import { ClienteComponent } from './cliente/cliente.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HeaderComponent } from './navigation/header/header.component';
import { SidenavListComponent } from './navigation/sidenav-list/sidenav-list.component';
import { SituacaoTipoComponent } from './situacao-tipo/situacao-tipo.component';
import { ClienteEditComponent } from './cliente/cliente-edit/cliente-edit.component';
import { ClienteService} from './cliente/cliente.service';
import { UnidadeFederativaComponent } from './unidade-federativa/unidade-federativa.component';
import { MunicipiosComponent } from './municipios/municipios.component';
import { EnderecoComponent } from './endereco/endereco.component';

@NgModule({
  declarations: [
    AppComponent,
    BaseFormComponent,
    HomeComponent,
    ClienteComponent,
    PageNotFoundComponent,
    NavbarComponent,
    HeaderComponent,
    SidenavListComponent,
    SituacaoTipoComponent,
    ClienteEditComponent,
    UnidadeFederativaComponent,
    MunicipiosComponent,
    EnderecoComponent   ,
    
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    CommonModule,
    AppRoutingModule    ,
    HttpClientModule,
    
  
  ],
  providers: [ClienteService,
    ClienteEnderecoService,
    EnderecoServiceService,
    UnidadeFederativaService],
  bootstrap: [AppComponent]
})
export class AppModule {

 }
