import { validateHorizontalPosition } from '@angular/cdk/overlay';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { ActivatedRoute } from '@angular/router';
import { timeStamp } from 'console';
import { Subscription } from 'rxjs';
import { ClienteService } from 'src/app/cliente/cliente.service';
import { ClienteViewModel } from 'src/app/cliente/clienteViewModel';
import { Profissional } from 'src/app/profissional/professional';
import { ProfissionalService } from 'src/app/profissional/profissional.service';
import { Servico } from 'src/app/servico/servico';
import { ServicosService } from 'src/app/servico/servicos.service';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { BaseFormComponent } from 'src/app/shared/base-form/base-form.component';
import { Agenda } from '../agenda';

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


  optionProfissional: Array<Profissional>=[];  
  optionServicos: Array<Servico>=[];  
  optionClientes: ClienteViewModel[];

  inscricaoProfissional$: Subscription;
  inscricaoServico$: Subscription;
  inscricaoClientes$: Subscription;

  allComplete: boolean = false;
  submit() {
    throw new Error('Method not implemented.');
  }

  constructor(private formBuilder: FormBuilder, 
             private alertService: AlertService,
             private profissionalService: ProfissionalService,
             private servicoService: ServicosService,
             private clienteService: ClienteService,
             private route: ActivatedRoute) {
    super();
  }

  ngOnInit(): void {
    this.tomorrow = new Date();

    this.dataSelecionada = new Date();
    this.criacaoFormulario();
    this.optionProfissional = [];
    this.optionServicos = [];
    this.listarProfissionais();
    this.listaCliente();
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
  }
  criacaoFormulario(){
    
    //formulario cliente
    this.formulario = this.formBuilder.group({    
      horaInicio: [null, Validators.required],
      horaFim: [null, Validators.required],
      codigoProfissional:[null, Validators.required],
      codigoServico: [null, Validators.required ], 
      codigoCliente: [null, Validators.required]
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
                                                                  valorComissao : Number.parseFloat(atob(profi.valorComissaoPercentual)),
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
                                                            valor : Number.parseFloat(atob(servico.valor))
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
  updateAllComplete(){

  }
}
