import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { EMPTY, Subscription } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Endereco } from '../endereco/endereco';
import { AlertService } from '../shared/alert/alert.service';
import { BaseFormComponent } from '../shared/base-form/base-form.component';
import { ApiResult } from '../shared/base.service';
import { Municipio } from '../shared/municipios/municipio';
import { MunicipioService } from '../shared/service/municipio.service';
import { UnidadeFederativaService } from '../shared/service/unidade-federativa.service';
import { UnidadeFederativa } from '../shared/UnidadeFederativa/unidadeFederativa';
import { Empresa } from './empresa';
import { EmpresaService } from './empresa.service';

@Component({
  selector: 'app-empresa',
  templateUrl: './empresa.component.html',
  styleUrls: ['./empresa.component.scss']
})
export class EmpresaComponent extends BaseFormComponent implements OnInit, OnDestroy {
 
  constructor(private empresaService:EmpresaService,
              private municipioService: MunicipioService,
              private unidadeFederativaService: UnidadeFederativaService,
              private formBuilder: UntypedFormBuilder,
              private alertService: AlertService
              ) {
    super();
  }

  formulario: UntypedFormGroup;
  empresa : Empresa;
  endereco : Endereco;
  inscricaoMunicipio$:Subscription;
  inscricao$:Subscription;
  inscricaoEstado$ :Subscription;

  descricaoMunicipio:string;
  estados: Array<UnidadeFederativa> = [];
  municipios: Array<Municipio> = [];
  codigoUnidadeFederativa : number;
  codigoMunicipio : number;

  ngOnInit(): void {    
   this.codigoMunicipio =0;
   this.codigoUnidadeFederativa =0;

   this. recuperarInformacoes();
   this.criarFormulario();
    this.carregarEstados();
    //municipios
     
      this.formulario.get("estado")
      .valueChanges
      .pipe(
        map(estado=>this.estados.filter(e=>e.codigo==estado)),
        map(estados=>estados && estados.length>0? estados[0].codigo : EMPTY),
        switchMap((estadoId: number) => {
          this.municipios = [];
          this.formulario.get('municipio').setValue(0);

          if (estadoId && estadoId !== undefined && estadoId > 0) {

            return this.municipioService.getMunicipioPorUF<ApiResult<Municipio>>(
              estadoId,
              0,
              1000,
              "descricao",
              "ASC",
              null,
              null,
            );
          } else {
            return EMPTY;
          }
        })
      ).subscribe(result=>{
          this.municipios = result.data;
      }) 
  }
  ngOnDestroy():void{
    if(this.inscricao$){
      this.inscricao$.unsubscribe();
    }
    if (this.inscricaoMunicipio$){
      this.inscricaoMunicipio$.unsubscribe();
    }
    if (this.inscricaoEstado$){
      this.inscricaoEstado$.unsubscribe();
    }
  }
  carregarFormulario(){
    
    this.formulario.controls["nome"].setValue(this.empresa.nome);
    this.formulario.controls["horaInicial"].setValue(this.empresa.horaInicial);
    this.formulario.controls["horaFinal"].setValue(this.empresa.horaFim);
    
    if (this.endereco == undefined  ){
      this.codigoMunicipio =0 ;
      this.codigoUnidadeFederativa =0;      
    }else{
      this.codigoMunicipio = this.endereco.codigoMunicipio ;
      this.codigoUnidadeFederativa =this.endereco.codigoUnidadeFederativa;    
      this.montaMunicipios(this.codigoUnidadeFederativa);

      this.formulario.controls["endereco"].setValue(this.endereco.descricao);
      this.formulario.controls["numero"].setValue(this.endereco.numero);
      if(this.endereco.complemento!==null){
        this.formulario.controls["Complemento"].setValue(this.endereco.complemento);
      }      
      this.formulario.controls["bairro"].setValue(this.endereco.bairro);
      this.formulario.controls["cep"].setValue(this.endereco.cep);

    }
    
    this.formulario.controls["estado"].setValue(this.codigoUnidadeFederativa);
    this.formulario.controls["municipio"].setValue(this.codigoMunicipio);

  }
  criarFormulario() {
    this.formulario = this.formBuilder.group({      
      nome: [this.empresa=== undefined ? '':this.empresa.nome, [Validators.required]],      
      horaInicial: [this.empresa=== undefined? '':this.empresa.horaInicial, [Validators.required]],
      horaFinal: [this.empresa=== undefined? '':this.empresa.horaFim, [Validators.required]],
      endereco: [this.endereco === undefined? '':this.endereco.descricao, [Validators.required]],
      numero: [this.endereco === undefined? '':this.endereco.numero, [Validators.required]],
      complemento:[this.endereco === undefined? '':this.endereco.complemento],
      bairro: [this.endereco === undefined? '':this.endereco.bairro, [Validators.required]],      
      cep:  [this.endereco === undefined? '':this.endereco.cep, [Validators.required,Validators.minLength(8),  Validators.pattern("[0-9]+")]],
      municipio : [this.codigoMunicipio , [Validators.required]],
      estado:  [this.codigoUnidadeFederativa, [Validators.required]]
    });
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
        this.handlerError('Erro ao carregar a lista de estados. Tente novamente mais tarde.');
      });
  }
  
  recuperarInformacoes(){
    this.inscricao$ = this.empresaService.recuperarDadosEmpresa()
    .subscribe(result=>{
      this.empresa =result;
      if (result.empresaEndereco !== undefined){
        this.endereco = result.empresaEndereco[0].endereco;
      }
      this.empresa.codigo= atob(result.codigo);
      this.empresa.nome= atob(result.nome);
      this.empresa.horaInicial= atob(result.horaInicial);
      this.empresa.horaFim= atob(result.horaFim);
      this.carregarFormulario();
     
    },error=>{
      console.log (error);
      this.handlerError('Ocorreu um erro ao recuperar informações da empresa');
    });
  }
  validacaoFormulario(){
    let valueSubmit = Object.assign({}, this.formulario.value);
    //nome
    if (valueSubmit.nome===undefined || valueSubmit.nome.trim ===''){
      this.handlerError('Atenção!Informe o nome da empresa!');
      return false;
    }    
    //endereco
    let endereco = valueSubmit.endereco;

    if(endereco === undefined || endereco.trim() ===''){
      this.handlerError('Atenção!Informe o endereco da empresa!');
      return false;
    }
    //rua
    if(valueSubmit.numero === undefined ||valueSubmit.numero.trim() ==='' ){
      this.handlerError('Atenção!Informe o número da empresa!');
      return false;
    }
    if (valueSubmit.bairro === undefined ||valueSubmit.bairro.trim() ==='' ){
      this.handlerError('Atenção!Informe o bairro da empresa!');
      return false;
    }
    //horario de funcionamento
    /* if ((valueSubmit.horaInicial < valueSubmit.horaFinal)||(valueSubmit.horaInicial === valueSubmit.horaFinal)){
      this.handlerError('Atenção!O período de funcionamento do estabelecimento está incorreto!');
      return false;
    } */
    return true;
  }  
  handlerError(message:string)
  {
    this.alertService.mensagemErro(message);
  }
  handlerSucesso(message:string){
    this.alertService.mensagemSucesso(message);
  }
  resetMunicipio() {
    this.formulario.get('municipio').reset();

  }
  submit() {
    if (!this.validacaoFormulario()){
      return ;
    }

    this.empresa.empresaEndereco.endereco = this.endereco;

    this.empresaService.atualizar(this.empresa)
                       .subscribe(result=>{
                        this.handlerSucesso('Salvado com sucesso!');
                       },error=>{
                        console.log(error);
                        this.handlerError('Ocorreu um erro!');
                       });
    
  }
  montaMunicipios(codigoUF : number){
    this.inscricaoMunicipio$ = this.municipioService.getMunicipioPorUF<ApiResult<Municipio>>(codigoUF,
                                                                                                0,
                                                                                                1000,
                                                                                                'descricao',
                                                                                                'ASC',
                                                                                                null,
                                                                                                null)
                                                    .subscribe(result=>{
                                                      this.municipios = result.data;
                                                    },error=>{
                                                      console.log(error);
                                                      this.handlerError('Ocorreu um erro ao tentar recuperar os municpios');
                                                    });
  }
}
