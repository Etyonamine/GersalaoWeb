import { Component, Inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EMPTY, Subscription } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AlertService } from '../shared/alert/alert.service';
import { BaseFormComponent } from '../shared/base-form/base-form.component';
import { ApiResult } from '../shared/base.service';
import { Municipio } from '../shared/municipios/municipio';
import { MunicipioService } from '../shared/service/municipio.service';
import { UnidadeFederativaService } from '../shared/service/unidade-federativa.service';
import { UnidadeFederativa } from '../shared/UnidadeFederativa/unidadeFederativa';
import { Endereco } from './endereco';
import { EnderecoService } from './endereco.service';

export interface DialogData {
  origemChamada: number;
  codigo: number;
}

@Component({
  selector: 'app-endereco',
  templateUrl: './endereco.component.html',
  styleUrls: ['./endereco.component.scss']
})
export class EnderecoComponent  implements OnInit {
  constructor(     
    private enderecoService: EnderecoService,
    private serviceAlert: AlertService,
    private unidadeFederativaService: UnidadeFederativaService,
    private municipioService: MunicipioService   ,
    public dialogRef: MatDialogRef<EnderecoComponent>,
    @Inject(MAT_DIALOG_DATA) public data:DialogData,
    
  )
  {}

  endereco:Endereco;


  submit() {}
  inscricaoEndereco$: Subscription;
  inscricaoEstado$:Subscription;
  inscricaoMunicipio$:Subscription;
  estados: Array<UnidadeFederativa> = [];
  municipios: Array<Municipio> = [];

  ngOnInit(): void {    
    this.recuperarDados();
    this.carregarEstados();
    //this.carregarMunicipios();
    
  }

  ngOnDestroy():void{
    if (this.inscricaoEndereco$){
      this.inscricaoEndereco$.unsubscribe();
    }
    if (this.inscricaoEstado$) {
      this.inscricaoEstado$.unsubscribe();
    }
    if (this.inscricaoMunicipio$) {
      this.inscricaoMunicipio$.unsubscribe();
    }
  }
 
  recuperarDados (){
    if (this.data.codigo !== undefined && this.data.codigo!== 0){
      this.inscricaoEndereco$ = this.enderecoService.get<Endereco>(this.data.codigo).subscribe(result=> this.endereco = result);     
    }else{
      this.endereco = <Endereco>{};
    }
    
  }

  carregarEstados() {
    this.inscricaoEstado$ = this.unidadeFederativaService
      .getData<ApiResult<UnidadeFederativa>>(
        0,
        30,
        "descricao",
        "ASC",
        null,
        null,
      )
      .subscribe(result => {
        if (result.data !== null) {

          this.estados = result.data;
        }

      }, error => {
        console.error(error);
        this.handleError('Erro ao carregar a lista de estados. Tente novamente mais tarde.');
      });
  }

  carregarMunicipios() {   
      if ((this.endereco.codigoUnidadeFederativa !== undefined)&&(this.endereco.codigoUnidadeFederativa !=0)){
        this.inscricaoMunicipio$ = this.municipioService.getMunicipioPorUF<ApiResult<Municipio>>(
          this.endereco.codigoUnidadeFederativa,
          0,
          1000,
          "descricao",
          "ASC",
          null,
          null,
        ).subscribe(result => { this.municipios = result.data; });  
      }else{
        this.municipios = [];
      }   
      
  }
  
  handleError(msg: string) {
    this.serviceAlert.mensagemErro(msg);
  }
  handlerSuccess(msg: string) {
    this.serviceAlert.mensagemSucesso(msg);
  }

  onEstadoSelecionado(){
    this.carregarMunicipios();

  }

    
  
}
