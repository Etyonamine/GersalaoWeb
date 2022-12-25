import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EMPTY, Subscription } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AuthService } from '../auth-guard/auth.service';
import { Documento } from '../documento/documento';
import { Endereco } from '../endereco/endereco';
import { EnderecoService } from '../endereco/endereco.service';
import { AlertService } from '../shared/alert/alert.service';
import { BaseFormComponent } from '../shared/base-form/base-form.component';
import { ApiResult } from '../shared/base.service';
import { Municipio } from '../shared/municipios/municipio';
import { MunicipioService } from '../shared/service/municipio.service';
import { UnidadeFederativaService } from '../shared/service/unidade-federativa.service';
import { UnidadeFederativa } from '../shared/UnidadeFederativa/unidadeFederativa';
import { Empresa } from './empresa';
import { EmpresaEndereco } from './empresa-endereco';
import { EmpresaService } from './empresa.service';

@Component({
  selector: 'app-empresa',
  templateUrl: './empresa.component.html',
  styleUrls: ['./empresa.component.scss']
})
export class EmpresaComponent extends BaseFormComponent implements OnInit, OnDestroy {
 
  constructor( private authService: AuthService,
              private empresaService:EmpresaService,
              private enderecoService:EnderecoService,
              private enderecoEmpresa : EnderecoService,
              private municipioService: MunicipioService,
              private unidadeFederativaService: UnidadeFederativaService,
              private formBuilder: FormBuilder,
              private alertService: AlertService
              ) {
    super();
  }

  formulario: FormGroup;
  empresa : Empresa;
  endereco : Endereco;
  documentoCNPJ : Documento;
  
  inscricaoMunicipio$:Subscription;
  inscricao$:Subscription;
  inscricaoEstado$ :Subscription;

  descricaoMunicipio:string;
  estados: Array<UnidadeFederativa> = [];
  municipios: Array<Municipio> = [];
  codigoUnidadeFederativa : number;
  codigoMunicipio : number;
  codigoUsuario : number;

  ngOnInit(): void {    
   this.codigoMunicipio =0;
   this.codigoUnidadeFederativa =0;
   this.authService.getUserData();
   this.codigoUsuario = Number.parseInt( this.authService.usuarioLogado.codigo);
   
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
          if (this.municipios.length>0 && this.codigoMunicipio > 0 ){
            this.formulario.controls["municipio"].setValue(this.codigoMunicipio);
          }
      }) 

      this. recuperarInformacoes();
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
    if (this.endereco == undefined || this.endereco === null  ){
      this.codigoMunicipio =0 ;
      this.codigoUnidadeFederativa =0;      
    }else{
      
      this.codigoUnidadeFederativa =this.endereco.codigoUnidadeFederativa;
      this.codigoMunicipio = this.endereco.codigoMunicipio;
    }

    this.formulario.controls["estado"].setValue(this.codigoUnidadeFederativa);
    this.formulario.controls["cnpj"].setValue('');  
    if (this.documentoCNPJ !== undefined){
      this.formulario.controls["cnpj"].setValue(this.documentoCNPJ.descricao);     
    }
   
    this.formulario.controls["endereco"].setValue(this.endereco.descricao);
    this.formulario.controls["numero"].setValue(this.endereco.numero);
    this.formulario.controls["bairro"].setValue(this.endereco.bairro);
    this.formulario.controls["complemento"].setValue(this.endereco.complemento);
    this.formulario.controls["cep"].setValue(this.endereco.cep);
   
    this.formulario.controls["municipio"].setValue(this.endereco.codigoMunicipio);
    

  }
  criarFormulario() {
    this.formulario = this.formBuilder.group({   
      cnpj: [null]   ,
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
      if (result.empresaEndereco !== undefined && result.empresaEndereco.length > 0){
        this.endereco = result.empresaEndereco[0].endereco;
      }
      if(result.empresaDocumento !== undefined && result.empresaDocumento.length>0){
        
        this.documentoCNPJ  = result.empresaDocumento.find(x=>x.Documento.codigoTipoDocumento == 3).Documento;//tipo de documento igual a cnpj
        this.documentoCNPJ.descricao = atob(this.documentoCNPJ.descricao);
      }
      
      this.empresa.nomeAbreviado = atob(result.nomeAbreviado.trim());
      this.empresa.codigo= atob(result.codigo);
      this.empresa.nome= atob(result.nome);
      this.empresa.horaInicial= atob(result.horaInicial);
      this.empresa.horaFim= atob(result.horaFim);
      this.empresa.quantidadeMinutosServico = atob(result.quantidadeMinutosServico);      
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
    if ((valueSubmit.horaInicial > valueSubmit.horaFinal)||(valueSubmit.horaInicial === valueSubmit.horaFinal)){
      this.handlerError('Atenção!O período de funcionamento do estabelecimento está incorreto!');
      return false;
    }
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
    this.recuperarInformacoes();
    let empresaGravar = this.empresa; 
    //Recuperando os valores do formulario
    let valueSubmitGravar = Object.assign({}, this.formulario.value);

    //dados da empresa
    empresaGravar.nome = valueSubmitGravar.nome ;     
    empresaGravar.quantidadeMinutosServico = "0";
    empresaGravar.horaInicial = valueSubmitGravar.horaInicial == undefined ? null : valueSubmitGravar.horaInicial;
    empresaGravar.horaFim = valueSubmitGravar.horaFinal == undefined ? null : valueSubmitGravar.horaFinal;
    
    //documento
    empresaGravar.empresaDocumento[0].Documento.descricao = valueSubmitGravar.cnpj.trim();

    //montando o endereço caso seja a primeira inclusao
    if (this.endereco === undefined){      
      this.endereco = {
        codigo : 0,
        descricao : valueSubmitGravar.endereco !== null || valueSubmitGravar.endereco === ''? valueSubmitGravar.endereco: "",
        numero : valueSubmitGravar.numero!== null || valueSubmitGravar.numero === ''? valueSubmitGravar.numero: "",
        bairro :  valueSubmitGravar.bairro !== null || valueSubmitGravar.bairro === ''? valueSubmitGravar.bairro: "",
        cep : valueSubmitGravar.cep !== null || valueSubmitGravar.cep === ''? valueSubmitGravar.cep: "",
        codigoMunicipio : this.codigoMunicipio ,      
        codigoTipoEndereco : 1,
        codigoUnidadeFederativa : this.codigoUnidadeFederativa,
        complemento : valueSubmitGravar.complemento !== null || valueSubmitGravar.complemento === ''?valueSubmitGravar.complemento:'',
        dataCadastro : this.DateWithoutTime(new Date),
        codigoUsuarioCadastrado : this.codigoUsuario,
        codigoSituacao : 1
      } as Endereco;      
     
    } 
    else
    {
      this.endereco.descricao = valueSubmitGravar.endereco !== null || valueSubmitGravar.endereco === ''? valueSubmitGravar.endereco: "";
      this.endereco.numero = valueSubmitGravar.numero!== null || valueSubmitGravar.numero === ''? valueSubmitGravar.numero: "";
      this.endereco.bairro =  valueSubmitGravar.bairro !== null || valueSubmitGravar.bairro === ''? valueSubmitGravar.bairro: "";
      this.endereco.cep = valueSubmitGravar.cep !== null || valueSubmitGravar.cep === ''? valueSubmitGravar.cep: "";
      this.endereco.codigoMunicipio = this.codigoMunicipio ;
      this.endereco.codigoUnidadeFederativa = this.codigoUnidadeFederativa;
      this.endereco.codigoTipoEndereco = 1;      
      this.endereco.complemento = valueSubmitGravar.complemento !== null || valueSubmitGravar.complemento === ''?valueSubmitGravar.complemento:'';
      this.endereco.codigoUsuarioAlteracao = this.codigoUsuario;

    }
    let listaEnderecos = [
      {
        codigoEmpresa : Number.parseInt(this.empresa.codigo),
        codigoEndereco : this.endereco == undefined || this.endereco === null? 0 :this.endereco.codigo ,
        endereco : this.endereco
      } as EmpresaEndereco
    ] as EmpresaEndereco[];
    //adicionar no objeto da empresa
    
    empresaGravar.empresaEndereco = listaEnderecos;
   
     
    //salvar dados
    this.empresaService.AtualizarInformacao(empresaGravar)
                       .subscribe(resultado=>{
                        this.handlerSucesso('Registro salvo com sucesso!');
                        setTimeout(() => {
                          
                        }, 3000);
                       },
                       error=>{
                        if (error.status == "400"){
                          this.alertService.mensagemExclamation(error.message);
                        }else{
                          console.log(error);
                          this.handlerError('Ocorreu o erro na tentativa de salvar o registro da empresa!');
                        }
                       });

  }
}
