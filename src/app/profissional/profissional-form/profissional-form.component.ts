import { ProfissionalServico } from './../profissional-servico/profissional-servico';
import { ProfissionalService } from 'src/app/profissional/profissional.service';
import { AuthService } from './../../auth-guard/auth.service';
import { Municipio } from './../../shared/municipios/municipio';
import { FormGroup, FormBuilder, Validators, AsyncValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { UnidadeFederativa } from 'src/app/shared/UnidadeFederativa/unidadeFederativa';
import { Profissional } from '../professional';
import { ProfissionalEndereco } from '../profissional-endereco/profissional-endereco';
import { ProfissionalContato } from '../profissional-contato/profissional-contato';
import { ProfissionalDocumento } from '../profissional-documento/profissional-documento';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { BaseFormComponent } from 'src/app/shared/base-form/base-form.component';
import { ActivatedRoute, Router } from '@angular/router';
import { TipoServico } from 'src/app/tipo-servico/tipo-servico';
import { TipoServicoService } from 'src/app/tipo-servico/tipo-servico.service';
import { MatDialog } from '@angular/material/dialog';
import { EnderecoComponent } from 'src/app/endereco/endereco.component';
import { Endereco } from 'src/app/endereco/endereco';
import { ContatoFormComponent } from 'src/app/contato/contato-form/contato-form.component';

import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import 'moment/locale/pt-br';
import { Contato } from 'src/app/contato/contato';
import { DocumentoFormComponent } from 'src/app/documento/documento-form/documento-form.component';
import { ProfissionalTipoServico } from '../profissional-tipo-servico/profissional-tipo-servico';
import { ProfissionalTipoServicoService } from '../profissional-tipo-servico/profissional-tipo-servico.service';

@Component({
  selector: 'app-profissional-form',
  templateUrl: './profissional-form.component.html',
  styleUrls: ['./profissional-form.component.scss'],
  providers: [
    // The locale would typically be provided on the root module of your application. We do it at
    // the component level here, due to limitations of our example generation script.
    {provide: MAT_DATE_LOCALE, useValue: 'pt-br'},

    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ],
})
export class ProfissionalFormComponent extends BaseFormComponent implements OnInit, OnDestroy {
  codigo = 0;
  formulario: FormGroup;
  profissional: Profissional;
  profissionalEnderecos: Array<ProfissionalEndereco> = [];
  profissionalContatos: Array<ProfissionalContato> = [];
  profissionalDocumentos: Array<ProfissionalDocumento> = [];
  profissionalTipoServicos: Array<ProfissionalTipoServico> = [];
  

  tituloPagina = '';
  descricaoBotaoSalvarEndereco = 'Incluir';
  inscricaoEstado$: Subscription;
  inscricaoMunicipio$: Subscription;
  inscricaoTipoServico$: Subscription;
  inscricaoAuthService$: Subscription;

  habilitaApagar = false;

  optionSituacao: Array<Object> = [{ value: 1, name: 'Ativo' }, { value: 2, name: 'Inativo' }];
  estados: Array<UnidadeFederativa> = [];
  municipios: Array<Municipio> = [];
  tipoServicos: Array<TipoServico> = [];
  servicoSelecionado: Array<number> = [];
  dadosEndereco: Endereco;
  dadosContato: Contato;

  codigoUsuario: number;

  salvarRegistro$: Subscription;

  constructor(private formBuilder: FormBuilder,
              private profissionalService: ProfissionalService,
              private serviceAlert: AlertService,
              private router: Router,
              private route: ActivatedRoute,
              private tipoServicoService: TipoServicoService,
              private authService: AuthService,
              public dialog: MatDialog    ) {
      super();
    }

  ngOnInit(): void {
    this.profissional = this.route.snapshot.data.profissional ? this.route.snapshot.data.profissional :  {} as Profissional;
    this.codigo = (this.profissional.codigo !== null && this.profissional.codigo !== undefined) ? this.profissional.codigo : 0;
    this.tituloPagina = this.codigo === 0 ? 'Novo Registro' : 'Alterar o registro';
    this.habilitaApagar = this.codigo === 0 ? true : false;
    this.criarFormulario();
    this.listaTipoServicos();
    this.dadosEndereco =  {} as Endereco;
    this.authService.getUserData();
    this.codigoUsuario = this.authService.usuarioLogado.Codigo;

  }

  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    if (this.inscricaoEstado$) {
      this.inscricaoEstado$.unsubscribe();
    }
    if (this.inscricaoMunicipio$) {
      this.inscricaoMunicipio$.unsubscribe();
    }
    if (this.inscricaoTipoServico$) {
      this.inscricaoTipoServico$.unsubscribe();
    }
    if (this.salvarRegistro$) {
      this.salvarRegistro$.unsubscribe();
    }
    if (this.inscricaoAuthService$) {
      this.inscricaoAuthService$.unsubscribe();
    }
  }

  submit() {

    const msgSucess = 'Profissional cadastrado com sucesso!';
    const msgError = 'Erro ao cadastrar outro profissional!';

    this.atualizarObjetos();
    this.profissional.codigo = this.codigo != null ? this.codigo : 0;
    if (this.profissional.codigo !== 0 ){
      this.salvarRegistro$ = this.profissionalService.Atualizar(this.profissional)
      .subscribe(sucesso => {
        this.handlerSuccess(msgSucess);
        setTimeout(() => { this.retornar(); }, 3000);
      },
        error => {
          console.error(error);
          this.handleError('Ocorreu um erro na tentativa de salvar o cadastro.');
        });                                      
    }else{
      this.salvarRegistro$ = this.profissionalService.save(this.profissional)
      .subscribe(sucesso => {
        this.handlerSuccess(msgSucess);
        setTimeout(() => { this.retornar(); }, 3000);
      },
        error => {
          console.error(error);
          this.handleError('Ocorreu um erro na tentativa de salvar o cadastro.');
        });
    }
    
  }

  criarFormulario() {
    let dataAniversario: string;

    const patternDataAniversario   = '\^([0]?[1-9]|[1|2][0-9]|[3][0|1])[./-]([0]?[1-9]|[1][0-2])[./-]([0-9]{4})$';
    if (this.profissional.dataAniversario !== null && this.profissional.dataAniversario !== undefined ) {

      if (this.profissional.dataAniversario.toString() !== '0001-01-01T00:00:00') {

        const dataNiverAux = this.profissional.dataAniversario.toString();

        const ano: string = dataNiverAux.toString().substring(0, 4);
        const mes: string = dataNiverAux.toString().substring(5, 7);
        const dia: string = dataNiverAux.toString().substring(8, 10);

        dataAniversario = dia + '/' + mes + '/' + ano;

      }
    }
// '^([0]?[1-9]|[1|2][0-9]|[3][0|1])[./-]([0]?[1-9]|[1][0-2])[./-]([0-9]{4})$')
    // criação dos formularios ************************************************
    // formulario Profissional
    this.formulario = this.formBuilder.group({
      codigo: [this.codigo],
      nome: [this.profissional.nome === undefined ? null : this.profissional.nome, [Validators.required, this.isDupeProfissional]],
      dataAniversario: [ dataAniversario === undefined ? null : dataAniversario, [Validators.pattern(patternDataAniversario)]],
      codigoSituacao: [this.profissional.codigoSituacao === undefined ? 1 : this.profissional.codigoSituacao, [Validators.required]],
      observacao: [this.profissional.observacao === undefined ? null : this.profissional.observacao],
      tipoServico: null
    });
  }

  listaTipoServicos() {
    this.inscricaoTipoServico$ = this.tipoServicoService.list<TipoServico[]>()
                                     .subscribe(result => {this.tipoServicos = result; }
                                     , error => {
      console.error(error);
      this.handleError('Erro ao carregar a lista de estados. Tente novamente mais tarde.');
    });

  }

  handleError(msg: string) {
    this.serviceAlert.mensagemErro(msg);
  }

  handlerSuccess(msg: string) {
    this.serviceAlert.mensagemSucesso(msg);
  }
  openConfirmExclusao() { }

  // ** validar se existe*/
  isDupeProfissional(): AsyncValidatorFn {


    return (control: AbstractControl): Observable<ValidationErrors | null> => {

      // verificando se é um caso de ediçao ou novo registro
      const ProfissionalValidar = (this.codigo) ? this.profissional :  {} as Profissional;

      ProfissionalValidar.codigo = this.codigo;
      ProfissionalValidar.nome = this.formulario.get('nome').value;

      return this.profissionalService.isDupe(ProfissionalValidar).pipe(map(result => {
        return (result ? { isDupeProfissional: true } : null);
      }));
    };
  }

  retornar() {
    this.router.navigate(['/profissional']);
  }
  atualizarObjetos() {
    this.tipoServicos = [];
    var listaTiposServico: Array<ProfissionalTipoServico> = [];

    const valueSubmit = Object.assign({}, this.formulario.value);
    let dataNiver: Date;
    if (valueSubmit.dataAniversario !== null  && valueSubmit.dataAniversario !== '') {
      const dataAux = valueSubmit.dataAniversario;
      const dataresult = dataAux.substring(6, 10) + '-' + dataAux.substring(3, 5) + '-' + dataAux.substring(0, 2) + 'T00:00:00';
      dataNiver = new Date(dataresult);
    } else {
      dataNiver = null;
    }

    // atualizacao
    if (this.profissional.codigo > 0 ) {
      this.profissional.codigousuarioalteracao =  this.codigoUsuario ;
    } else {
      this.profissional.codigousuariocadastro =  this.codigoUsuario ;
    }

    this.profissional.nome = valueSubmit.nome;
    if (dataNiver !== null) {
      this.profissional.dataAniversario = dataNiver;
    }

    this.profissional.codigoSituacao = valueSubmit.codigoSituacao;
    this.profissional.observacao = valueSubmit.observacao;

    // tipos de servicos
    if (this.servicoSelecionado.length > 0 ){      
     this.servicoSelecionado.forEach( tpServi =>{

          //profissional tipo 
          const profissionalTipoServico = {
            codigoProfissional : this.codigo,
            codigoTipoServico : tpServi,
            codigoUsuario : this.codigoUsuario,
            dataCadastro : new Date(),
            valorComissao : 0 
          } as ProfissionalTipoServico;

          // adicionando na lista de tipos de servico do profissional
          listaTiposServico.push(profissionalTipoServico);
        }       
     )
    }
    this.profissional.listatiposervico = listaTiposServico;

  }
  tipoServicoSelecionado(event, opt, codigoTipoServico) {

    const rep = [];

    if (event.checked === true) {
        // userResponse.push(opt);
        this.servicoSelecionado.push(codigoTipoServico);
    }

    if (event.checked === false) {
        const index: number = this.servicoSelecionado.indexOf(codigoTipoServico);
        this.servicoSelecionado.splice(index, 1);

    }
    console.log (this.servicoSelecionado);

  }
  openDialogEndereco(): void {
    const dialogRef = this.dialog.open(EnderecoComponent,
      {width: '1000px' , height: '600px;',
        data : { origemChamada: 2, codigo: this.codigo, codigoUsuario : this.codigoUsuario} }
    );

    dialogRef.afterClosed().subscribe(result => {
      if (result !== '') {
        this.dadosEndereco = result;
      }
    });
  }
  openDialogContato(): void {
    const dialogRef = this.dialog.open(ContatoFormComponent,
      { width: '800px' ,
       height: '600px;',
       data : { origemChamada: 2, codigo: this.codigo, codigoUsuario : this.codigoUsuario} }
    );

    /* dialogRef.afterClosed().subscribe(result => {
      if (result != '') {
        this.dadosContato = result;
      }
    }); */
  }
  openDialogDocumento() {
    const dialogRef = this.dialog.open(DocumentoFormComponent,
      { width: '800px' ,
       height: '600px;',
       data : { origemChamada: 2, codigoProfissional: this.codigo, codigoUsuario : this.codigoUsuario} }
    );
  }


}
