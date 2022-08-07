import { validateHorizontalPosition } from '@angular/cdk/overlay';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { ActivatedRoute } from '@angular/router';
import { timeStamp } from 'console';
import { of, Subscription } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth-guard/auth.service';
import { ClienteService } from 'src/app/cliente/cliente.service';
import { ClienteViewModel } from 'src/app/cliente/clienteViewModel';
import { Empresa } from 'src/app/empresa/empresa';
import { EmpresaService } from 'src/app/empresa/empresa.service';
import { Profissional } from 'src/app/profissional/professional';
import { ProfissionalService } from 'src/app/profissional/profissional.service';
import { Servico } from 'src/app/servico/servico';
import { ServicosService } from 'src/app/servico/servicos.service';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { BaseFormComponent } from 'src/app/shared/base-form/base-form.component';
import { Agenda } from '../agenda';
import { AgendaService } from '../agenda.service';

@Component({
  selector: 'app-agenda-form',
  templateUrl: './agenda-form.component.html',
  styleUrls: ['./agenda-form.component.scss']
})
export class AgendaFormComponent extends BaseFormComponent implements OnInit, OnDestroy {
  formulario: FormGroup;
  formServicos: FormGroup;
  agenda: Agenda;
  dataSelecionada: Date | null;
  tomorrow:Date;
  horaInicioDefault: string;
  horaFimDefault: string;
  codigoUsuario: number; 
  
  optionProfissional: Array<Profissional>=[];  
  optionServicos: Array<Servico>=[];  
  optionClientes: ClienteViewModel[];

  inscricaoAgenda$: Subscription;
  inscricaoProfissional$: Subscription;
  inscricaoServico$: Subscription;
  inscricaoClientes$: Subscription;
  inscricaoEmpresa$: Subscription;

  allComplete: boolean = false;


  constructor(private formBuilder: FormBuilder, 
    private alertService: AlertService,
    private profissionalService: ProfissionalService,
    private servicoService: ServicosService,
    private clienteService: ClienteService,
    private empresaService: EmpresaService,
    private authService : AuthService,
    private agendaService: AgendaService,
    private route: ActivatedRoute) {
super();
}


  submit() {
    if (this.validadorHoraInformado()== false){
      return ;
    }
    let dataHoraSelecionada = new Date(this.formulario.get("dataAgenda").value + ' ' 
                                                           + this.formulario.get("horaAgenda").value);

    let valueSubmit = Object.assign({}, this.formulario.value);

    let agendaGravar = {
      codigo: 0,
      codigoCliente : valueSubmit.codigoCliente,
      codigoProfissional : valueSubmit.codigoProfissional,
      codigoServico : valueSubmit.codigoServico,
      data : this.converteDataHoraSemTimeZone( dataHoraSelecionada),
      valorServico : this.optionServicos.find(x=>x.codigo == valueSubmit.codigoServico).valor,
      valorComissaoPercentual : this.optionProfissional.find(x=>x.codigo == valueSubmit.codigoProfissional).valorComissao,
      observacao : valueSubmit.observacao,
      codigoUsuarioCadastro : this.codigoUsuario,      
      codigoSituacaoServico : 3,
      codigoSituacaoBaixa : 5,
      dataUsuarioCadastro : this.dataHoraAtualSemTimeZone()
    } as Agenda;
    
    //valida se já existe a agenda cadstrada
    this.inscricaoAgenda$ = this.agendaService.isDupe(agendaGravar).pipe(concatMap(result=>{
      return of (result);
    })).subscribe(retorno=>{
      if (!retorno){
            //gravando no banco de dados.
            this.inscricaoAgenda$ = this.agendaService.save(agendaGravar)
            .subscribe(result=>{
              if (result){
                this.handlerSucesso('Gravado com sucesso!');
              }else{
                this.handleError('Não foi gravado a agenda.');
              }
            },error=>{
              console.log(error);
              this.handleError('Ocorreu um erro ao tentar gravar a agenda.');
            })
        
      }else{
        this.handlerExclamacao("Esta agenda já existe!");        
      }
    },error=>{
      console.log (error);
      this.handleError('Ocorreu um erro ao validar a existência da agenda.');
      return;
    });

    
    
  }


  ngOnInit(): void {
    this.tomorrow = new Date();

    this.dataSelecionada = new Date();
    this.recuperarDadosEmpresa();
    this.criacaoFormulario();
    this.optionProfissional = [];
    this.optionServicos = [];
    this.listarProfissionais();
    this.listaCliente();    
    this.codigoUsuario =  Number.parseInt(this.authService.usuarioLogado.codigo);
    
  }
  ngOnDestroy():void {
    if (this.inscricaoProfissional$){
      this.inscricaoProfissional$.unsubscribe();      
    }
    if (this.inscricaoServico$){
      this.inscricaoServico$.unsubscribe();
    }
    if (this.inscricaoClientes$){
      this.inscricaoClientes$.unsubscribe();
    }
    if (this.inscricaoEmpresa$){
      this.inscricaoEmpresa$.unsubscribe();
    }
    if (this.inscricaoAgenda$){
      this.inscricaoAgenda$.unsubscribe();
    }
  }
  criacaoFormulario(){
    
    //formulario cliente
    this.formulario = this.formBuilder.group({    
      dataAgenda: [new Date(),Validators.required],  
      horaAgenda: [ null,Validators.required] ,      
      codigoProfissional:[null, Validators.required],
      codigoServico: [null, Validators.required ], 
      codigoCliente: [null, Validators.required],
      observacao: [null]
    });
  }  
  handlerSucesso(mensagem:string)
  {
    this.alertService.mensagemSucesso(mensagem);
  }
  handleError(mensagem:string)
  {
    this.alertService.mensagemErro(mensagem);
  }

  listarProfissionais(){
    this.inscricaoProfissional$ = this.profissionalService.ListarProfissionais()
                                                          .subscribe(result=>{
                                                            if (result){
                                                              result.forEach(profi=>{
                                                                this.optionProfissional.push({
                                                                  codigo : Number.parseInt(atob(profi.codigo)),
                                                                  nome : atob(profi.nome),
                                                                  valorComissao : Number.parseFloat(atob(profi.valorComissaoPercentual).replace(',','.')),
                                                                  codigoTipoServico : Number.parseInt(atob(profi.tipoServico.codigo))
                                                                }as Profissional);
                                                              })
                                                            }
                                                            
                                                          },
                                                          error=>{
                                                            console.log(error);
                                                            this.handleError('Ocorreu um erro ao listar os Profissionais.');
                                                          })
  }

  listaServicos(event){
    let objProfissional= this.optionProfissional.find(x=>x.codigo === this.formulario.get('codigoProfissional').value) ;
    
    if (this.optionServicos.length>0){
      this.optionServicos.splice(0,this.optionServicos.length);  
    }
    
    if (objProfissional!== null){
      //pesquisando no serviço pelo tipo
      this.inscricaoServico$ = this.servicoService.listarServicoPorTipo(objProfissional.codigoTipoServico.toString())
                                                  .subscribe(result=>{
                                                    if (result){                                                      
                                                        result.forEach(servico =>{
                                                          this.optionServicos.push({
                                                            codigo : Number.parseInt(atob(servico.codigo)),
                                                            descricao : atob(servico.descricao),
                                                            valor : Number.parseFloat(atob(servico.valor).replace(',','.'))
                                                        } as Servico)
                                                        });                                                      
                                                    }
                                                  })
    }

    //this.inscricaoServico$ = this.servicoService.
  }
  listaCliente(){
    this.optionClientes = null;

    this.inscricaoClientes$ = this.clienteService.listaClientes()
                                                .subscribe(result=>{
                                                  if (result){
                                                    this.optionClientes = this.clienteService.ConverterListaCriptografadaCliente(result);
                                                  }                                                                                                      
                                                },
                                                error=>{
                                                  console.log(error);
                                                  this.handleError('Ocorreu um erro ao listar os clientes.');
                                                })
  }
  recuperarDadosEmpresa(){
    this.inscricaoEmpresa$ = this.empresaService.recuperarDadosEmpresa().subscribe(result=>{
      
      this.horaInicioDefault = atob(result.horaInicial).substring(0,5);
      this.horaFimDefault = atob(result.horaFim).substring(0,5);
      console.log(this.horaInicioDefault);
      console.log(this.horaFimDefault);

    });
  }
  validadorHoraInformado(){
    let dataDia = new Date(this.formulario.get("dataAgenda").value).toLocaleDateString('pt');
    let dataDiaHoraInicial = new Date(dataDia + ' ' + this.horaInicioDefault);
    let dataDiaHoraFinal =  new Date(dataDia + ' ' + this.horaFimDefault);
    let dataDiaHoraSelecionada = new Date(dataDia + ' ' + this.formulario.get("horaAgenda").value);
    
    if  (dataDiaHoraInicial.getTime() > dataDiaHoraSelecionada.getTime()){
      this.handlerExclamacao('A hora de agenda informada é menor do que o inìcio de funcionamento do estabelecimento.')      ;
      return false;
    }
    if  (dataDiaHoraFinal.getTime() < dataDiaHoraSelecionada.getTime()){
       this.handlerExclamacao('A hora de agenda informada é maior do que o fim de funcionamento do estabelecimento.')      ;
      return false;
    }
    return true;
  }
  handlerExclamacao(mensagem:string){
    this.alertService.mensagemExclamation(mensagem);
  }
}
