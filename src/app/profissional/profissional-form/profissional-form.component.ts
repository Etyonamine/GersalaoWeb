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
import { ActivatedRoute, Router } from '@angular/router';
import { TipoServico } from 'src/app/tipo-servico/tipo-servico';
import { TipoServicoService } from 'src/app/tipo-servico/tipo-servico.service';
import { MatDialog } from '@angular/material/dialog';
import { EnderecoComponent } from 'src/app/endereco/endereco.component';
import { Endereco } from 'src/app/endereco/endereco';



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
  servicoSelecionado : Array<number>=[];  
  dadosEndereco : Endereco;  

  salvarRegistro$: Subscription;

  constructor(private formBuilder: FormBuilder,
    private profissionalService: ProfissionalService,
    private unidadeFederativaService: UnidadeFederativaService,
    private municipioService: MunicipioService,
    private serviceAlert: AlertService,
    private validarCpf: ValidaCpfService,
    private router: Router,
    private route: ActivatedRoute,
    private tipoServicoService: TipoServicoService,
    public dialog: MatDialog
    ) 
    {
      super();
    }

  ngOnInit(): void {
    this.profissional = this.route.snapshot.data['profissional'] ? this.route.snapshot.data['profissional']:<Profissional>{};
    this.codigo = (this.profissional.codigo !== null && this.profissional.codigo !== undefined) ? this.profissional.codigo : 0;
    this.tituloPagina = this.codigo == 0 ? 'Novo Registro' : 'Alterar o registro';
    this.habilitaApagar = this.codigo == 0 ? true : false;
    this.criarFormulario();
     
    this.listaTipoServicos();
    this.dadosEndereco = <Endereco>{};

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
    if(this.salvarRegistro$){
      this.salvarRegistro$.unsubscribe();
    }
  }
  submit() {

    let msgSucess = 'Profissional cadastrado com sucesso!';
    let msgError = 'Erro ao cadastrar outro profissional!';

    this.atualizarObjetos();
    this.profissional.codigo = this.codigo!=null ?this.codigo:0;
    
     this.salvarRegistro$ = this.profissionalService.save(this.profissional)
    .subscribe(sucesso => {
      this.handlerSuccess(msgSucess);
      setTimeout(() => { this.retornar(); }, 3000);
    },
      error => {
        console.error(error);
        this.handleError("Ocorreu um erro na tentativa de salvar o cadastro.");
      }); 
  }
  criarFormulario() {
    //criação dos formularios ************************************************
    //formulario Profissional
    this.formulario = this.formBuilder.group({
      codigo: [this.codigo],
      nome: [this.profissional.nome === undefined ? null : this.profissional.nome, [Validators.required, this.isDupeProfissional]],
      //dataaniversario: [null, [Validators.pattern('^([0]?[1-9]|[1|2][0-9]|[3][0|1])[./-]([0]?[1-9]|[1][0-2])[./-]([0-9]{4}|[0-9]{2})$')]],
      dataaniversario: [this.profissional.dataaniversario === undefined ? null : this.profissional.dataaniversario, [Validators.pattern('^([0]?[1-9]|[1|2][0-9]|[3][0|1])[./-]([0]?[1-9]|[1][0-2])[./-]([0-9]{4})$')]],
      codigoSituacao: [this.profissional.codigoSituacao === undefined ? 1 : this.profissional.codigoSituacao, [Validators.required]],
      observacao: [this.profissional.observacao === undefined ? null : this.profissional.observacao]       
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
    
    
    
  }
  tipoServicoSelecionado(event, opt, codigoTipoServico) {

    var rep = [];
  
    if (event.checked === true) {
        //userResponse.push(opt);
        this.servicoSelecionado.push(codigoTipoServico);
    }

    if (event.checked === false) {
        var index: number = this.servicoSelecionado.indexOf(codigoTipoServico);
        this.servicoSelecionado.splice(index, 1);
        
    }
   

  }
  openDialogEndereco():void{
    const dialogRef = this.dialog.open(EnderecoComponent,        
      {data : { origemChamada:2, codigo:this.codigo} }
    );
    
    dialogRef.afterClosed().subscribe(result => {
      if (result!=''){
        this.dadosEndereco = result;
        console.log (result);
      }      
    });
  }
   

}
