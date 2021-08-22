import { ProfissionalService } from './../profissional.service';
import { Municipio } from './../../shared/municipios/municipio';
import { FormGroup, FormBuilder, Validators, AsyncValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { UnidadeFederativa } from 'src/app/shared/UnidadeFederativa/unidadeFederativa';
import { Profissional } from '../professional';
import { ProfissionalEndereco } from '../profissional-endereco/profissional-endereco';
import { ProfissionalContato } from '../profissional-contato/profissional-contato';
import { ProfissionalDocumento } from '../profissional-documento/profissional-documento';
import { EMPTY, Observable, Subscription } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { MunicipioService } from 'src/app/shared/service/municipio.service';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { ValidaCpfService } from 'src/app/shared/service/valida-cpf.service';
import { BaseFormComponent } from 'src/app/shared/base-form/base-form.component';
import { ApiResult } from 'src/app/shared/base.service';
import { UnidadeFederativaService } from 'src/app/shared/service/unidade-federativa.service';
import { Router } from '@angular/router';
import { TipoServico } from 'src/app/tipo-servico/tipo-servico';
import { TipoServicoService } from 'src/app/tipo-servico/tipo-servico.service';

@Component({
  selector: 'app-profissional-form',
  templateUrl: './profissional-form.component.html',
  styleUrls: ['./profissional-form.component.scss']
})
export class ProfissionalFormComponent extends BaseFormComponent implements OnInit {

  codigo: number = 0;
  formulario: FormGroup;
  profissional: Profissional;
  profissionalEnderecos: Array<ProfissionalEndereco> = [];
  profissionalContatos: Array<ProfissionalContato> = [];
  profissionalDocumentos: Array<ProfissionalDocumento> = [];

  tituloPagina: string = '';
  descricaoBotaoSalvarEndereco: string = 'Incluir';
  inscricaoEstado$: Subscription;
  inscricaoMunicipio$: Subscription;
  inscricaoTipoServico$:Subscription;

  habilitaApagar: boolean = false;

  optionSituacao: Array<Object> = [{ value: 1, name: "Ativo" }, { value: 2, name: "Inativo" }];
  estados: Array<UnidadeFederativa> = [];
  municipios: Array<Municipio> = [];
  tipoServicos: Array<TipoServico> = [];


  constructor(private formBuilder: FormBuilder,
    private profissionalService: ProfissionalService,
    private unidadeFederativaService: UnidadeFederativaService,
    private municipioService: MunicipioService,
    private serviceAlert: AlertService,
    private validarCpf: ValidaCpfService,
    private router: Router,
    private tipoServicoService: TipoServicoService) {
    super();
  }

  ngOnInit(): void {

    this.tituloPagina = this.codigo == 0 ? 'Novo Registro' : 'Alterar o registro';
    this.habilitaApagar = this.codigo == 0 ? true : false;
    this.criarFormulario();
    this.carregarEstados();
    this.carregarMunicipios();
    this.listaTipoServicos();

  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if (this.inscricaoEstado$) {
      this.inscricaoEstado$.unsubscribe();
    }
    if (this.inscricaoMunicipio$) {
      this.inscricaoMunicipio$.unsubscribe();
    }
    if(this.inscricaoTipoServico$){
      this.inscricaoTipoServico$.unsubscribe();
    }
  }

  submit() {
    this.atualizarObjetos();
  }

  criarFormulario() {
    //criação dos formularios ************************************************
    //formulario Profissional
    this.formulario = this.formBuilder.group({
      codigo: [null],
      nome: [null, [Validators.required, this.isDupeProfissional]],
      //dataaniversario: [null, [Validators.pattern('^([0]?[1-9]|[1|2][0-9]|[3][0|1])[./-]([0]?[1-9]|[1][0-2])[./-]([0-9]{4}|[0-9]{2})$')]],
      dataaniversario: [null, [Validators.pattern('^([0]?[1-9]|[1|2][0-9]|[3][0|1])[./-]([0]?[1-9]|[1][0-2])[./-]([0-9]{4})$')]],
      codigoSituacao: [1, [Validators.required]],
      observacao: [null],
      endereco: this.formBuilder.group({
        rua: [null],
        cep: [null, [Validators.minLength(8), Validators.pattern(/^-?(0|[0-9]\d*)?$/)]],
        numero: [null],
        complemento: [null],
        bairro: [null],
        municipio: [null],
        estado: [null]
      }),
      contato: this.formBuilder.group({
        telefoneFixo: [null, [Validators.minLength(10), Validators.pattern(/^-?(0|[0-9]\d*)?$/)]],
        celular: [null, [Validators.minLength(11), Validators.pattern(/^-?(0|[0-9]\d*)?$/)]],
        email: [null, [Validators.email]]
      }),
      documento: this.formBuilder.group({
        rg: [null],
        cpf: [null, [Validators.minLength(11), this.validarCpf.isValidCpf()]]
      }),
      servico: this.formBuilder.group({
        tipoServico:[null]
      })
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
        this.handleError('Erro ao carregar a lista de estados. Tente novamente mais tarde.');
      });
  }

  listaTipoServicos(){
    this.inscricaoTipoServico$ = this.tipoServicoService.list<TipoServico[]>()
                                     .subscribe(result=>{this.tipoServicos = result}
                                     , error => {
      console.error(error);
      this.handleError('Erro ao carregar a lista de estados. Tente novamente mais tarde.');
    });

  }

  carregarMunicipios() {
    this.inscricaoMunicipio$ = this.formulario.get('endereco.estado')
      .valueChanges
      .pipe(
        map(estado => this.estados.filter(e => e.codigo === estado)),
        map(estados => estados && estados.length > 0 ? estados[0].codigo : EMPTY),
        switchMap(
          (estadoId: number) => {
            this.municipios = [];
            this.formulario.get('endereco.municipio').setValue(0);

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

            // if estadoId && estadoId !== undefined ?

            // this.municipioService.getMunicipioPorUF<ApiResult<Municipio>>(
            //   estadoId,
            //   0,
            //   1000,
            //   "descricao",
            //   "ASC",
            //   null,
            //   null,
            // );
            // : EMPTY
          }
        )
      ).subscribe(result => { this.municipios = result.data; });
  }

  handleError(msg: string) {
    this.serviceAlert.mensagemErro(msg);
  }

  handlerSuccess(msg: string) {
    this.serviceAlert.mensagemSucesso(msg);
  }
  openConfirmExclusao() { }
  //** validar se existe*/
  isDupeProfissional(): AsyncValidatorFn {


    return (control: AbstractControl): Observable<ValidationErrors | null> => {

      //verificando se é um caso de ediçao ou novo registro
      var ProfissionalValidar = (this.codigo) ? this.profissional : <Profissional>{};

      ProfissionalValidar.codigo = this.codigo;
      ProfissionalValidar.nome = this.formulario.get('nome').value;

      return this.profissionalService.isDupe(ProfissionalValidar).pipe(map(result => {
        return (result ? { isDupeProfissional: true } : null);
      }));
    }
  }
  retornar() {
    this.router.navigate(['/profissional']);
  }

  atualizarObjetos() {

    let valueSubmit = Object.assign({}, this.formulario.value);
    var dataNiver : Date;
    if (valueSubmit.dataaniversario !== null  && valueSubmit.dataaniversario !== ''){
      var dataAux = valueSubmit.dataaniversario;
      var dataresult = dataAux.substring(6,10) + '-' + dataAux.substring(3,5) + '-' + dataAux.substring(0,2) + 'T00:00:00';
      dataNiver = new Date(dataresult);
    }else{
      dataNiver = null;
    }

    this.profissional = valueSubmit;
    console.log(this.profissional);

    //profissional-endereco
  }
}
