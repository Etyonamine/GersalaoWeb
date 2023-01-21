import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AgendaPagamento } from '../agenda-pagamento/agenda-pagamento';
import { AgendaPagamentoService } from '../agenda-pagamento/agenda-pagamento.service';
import { AuthService } from '../auth-guard/auth.service';
import { MotivoEstornoServicoPagamento } from '../motivo-estorno-servico-pagamento/motivo-estorno-servico-pagamento';
import { MotivoEstornoServicoPagamentoService } from '../motivo-estorno-servico-pagamento/motivo-estorno-servico-pagamento.service';
import { AlertService } from '../shared/alert/alert.service';
import { BaseFormComponent } from '../shared/base-form/base-form.component';
import { AgendaServicoPagamentoEstorno } from './agenda-servico-pagamento-estorno';
import { AgendaServicoPagamentoEstornoService } from './agenda-servico-pagamento-estorno.service';

@Component({
  selector: 'app-agenda-estorno',
  templateUrl: './agenda-estorno.component.html',
  styleUrls: ['./agenda-estorno.component.scss']
})
export class AgendaEstornoComponent extends BaseFormComponent  implements OnInit, OnDestroy {
 
  formulario: FormGroup;
  inscricaoPagamento$: Subscription;
  inscricaoMotivo$: Subscription;
  inscricaoAgendaServicoPagamentoEstornoServce$: Subscription;
  codigoUsuario: number; 
  valorMaximo: number;
  listaPagamentos: AgendaPagamento[]=[];
  listaMotivoEstornos: MotivoEstornoServicoPagamento[]=[];

  constructor(@Inject(MAT_DIALOG_DATA) public codigoAgenda: number,
              private authService : AuthService,
              private formBuilder: FormBuilder,
              private alertService: AlertService,
              private agendaServicoPagamento:AgendaPagamentoService,
              private motivoEstornoServicoPagamentoService: MotivoEstornoServicoPagamentoService,
              private agendaServicoPagamentoEstornoService: AgendaServicoPagamentoEstornoService) 
              {
    super();
  }

  ngOnInit(): void {
    this.valorMaximo =0 ;
    this.recuperarListaPagamentos();
    this.recuperarMotivosEstornos();
    this.criacaoFormulario();
    this.codigoUsuario =  Number.parseInt(this.authService.usuarioLogado.codigo);
  }
  ngOnDestroy():void{
    if(this.inscricaoPagamento$){
      this.inscricaoPagamento$.unsubscribe();
    }
    if(this.inscricaoMotivo$){this.inscricaoMotivo$.unsubscribe();}
    if (this.inscricaoAgendaServicoPagamentoEstornoServce$){this.inscricaoAgendaServicoPagamentoEstornoServce$.unsubscribe();}

  }
  handlerSucesso(mensagem:string)
  {
    this.alertService.mensagemSucesso(mensagem);
  }
  handleError(mensagem:string)
  {
    this.alertService.mensagemErro(mensagem);
  }
  handlerExclamacao(mensagem:string){
    this.alertService.mensagemExclamation(mensagem);
  }
  criacaoFormulario(){     
    //formulario 
    this.formulario = this.formBuilder.group({          
      codigoPagamento: [null, Validators.required],
      codigoMotivoEstorno: [null, Validators.required],
      observacaoDoEstorno: [null],
      valorEstornar: [0, Validators.required]
    });    
  }
  recuperarListaPagamentos(){
    this.inscricaoPagamento$ = this.agendaServicoPagamento.recuperarPagamentoAEstonarPorAgenda(this.codigoAgenda)
                                                          .subscribe(result=>{
                                                            this.listaPagamentos = result;
                                                          },error =>{
                                                            console.log(error);
                                                            this.handleError('Ocorreu erro ao recuperar informações de pagamento.');
                                                          });
  }  
  recuperarMotivosEstornos(){
    this.inscricaoMotivo$ = this.motivoEstornoServicoPagamentoService.list<MotivoEstornoServicoPagamento[]>()
                                                                     .subscribe(result=>{
                                                                      this.listaMotivoEstornos = result;
                                                                     }) ;
  }
  preencherValorEstorno(){
    let pagamentoSelecionado = this.listaPagamentos.find(x=>x.codigo === this.formulario.get('codigoPagamento').value);
    this.formulario.controls['valorEstornar'].setValue(pagamentoSelecionado.valorPagamento);
    this.valorMaximo = pagamentoSelecionado.valorPagamento;

  }
  submit() {

    let valueSubmit = Object.assign({}, this.formulario.value);

    let agendaServicoPagamentoEstornoGravar = {
      codigo: 0,
      codigoAgendaServicoPagamento: valueSubmit.codigoPagamento,
      codigoMotivoEstorno: valueSubmit.codigoMotivoEstorno,
      codigoUsuarioCadastro:this.codigoUsuario,
      valorEstorno: valueSubmit.valorEstornar,
      dataCadastro: new Date(),
      observacao: valueSubmit.observacaoDoEstorno    
    } as AgendaServicoPagamentoEstorno;
    this.alertService.openConfirmModal('Por favor, confirmar se deseja continuar com o estorno?', 'Agendar - Pagamento - Estorno', (resposta: boolean) => {
          if (resposta) {
        //gravando 
        this.inscricaoAgendaServicoPagamentoEstornoServce$ = this.agendaServicoPagamentoEstornoService.save(agendaServicoPagamentoEstornoGravar)
                                                                                                      .subscribe(result=>
                                                                                                        {
                                                                                                          if (result){
                                                                                                            this.handlerSucesso('Registro salvo com sucesso!');
                                                                                                            this.limparCampos();
                                                                                                          }else{
                                                                                                            this.handleError('Ocorreu algum erro ao tentar salvar o registro.');
                                                                                                          }
                                                                                                        },error=>{
                                                                                                          console.log(error);
                                                                                                        });
        }}, 'Sim', 'Não'
    );
  }
  limparCampos(){
    this.formulario.reset();
    this.recuperarListaPagamentos();

  }  
}
