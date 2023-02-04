import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth-guard/auth.service';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { BaseFormComponent } from 'src/app/shared/base-form/base-form.component';
import { ProfissionalApuracaoPagamento } from '../profissional-apuracao-pagamento/profissional-apuracao-pagamento';
import { ProfissionalApuracaoPagamentoService } from '../profissional-apuracao-pagamento/profissional-apuracao-pagamento.service';
import { ProfissionalPagamentoCancelarIn } from '../profissional-apuracao-pagamento/profissional-pagamento-cancelar-in';

@Component({
  selector: 'app-profissional-apuracao-estorno-pagamento',
  templateUrl: './profissional-apuracao-estorno-pagamento.component.html',
  styleUrls: ['./profissional-apuracao-estorno-pagamento.component.scss']
})
export class ProfissionalApuracaoEstornoPagamentoComponent extends BaseFormComponent implements OnInit, OnDestroy {
  formulario: FormGroup;
  inscricao$: Subscription;

  listaPagamentos: ProfissionalApuracaoPagamento[] = [];
  codigoUsuario: number;

  constructor(@Inject(MAT_DIALOG_DATA) public codigoApuracao: number,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private profissionalApuracaoPagamentoService: ProfissionalApuracaoPagamentoService,
    private authService: AuthService) {
    super();
  }
  ngOnInit(): void {
    this.recuperarListaPagamentos();
    this.criacaoFormulario();
    this.authService.getUserData();
    this.codigoUsuario = Number.parseInt(this.authService.usuarioLogado.codigo);
  }
  ngOnDestroy(): void {
    if (this.inscricao$) {
      this.inscricao$.unsubscribe();
    }
  }
  criacaoFormulario() {
    //formulario
    this.formulario = this.formBuilder.group({
      codigoProfissionalApuracao: [{ value: this.codigoApuracao, disabled: true }],
      codigoPagamento: [null, Validators.required],
      observacao: [null, Validators.required]
    });
  }
  recuperarListaPagamentos() {
    this.inscricao$ = this.profissionalApuracaoPagamentoService.recuperarLista(this.codigoApuracao)
      .subscribe(result => {
        this.listaPagamentos = result;
      }, error => {
        console.log(error);
        this.handleError('Ocorreu erro ao recuperar a lista de pagamentos.');
      });
  }
  handlerSucesso(mensagem: string) {
    this.alertService.mensagemSucesso(mensagem);
  }
  handleError(mensagem: string) {
    this.alertService.mensagemErro(mensagem);
  }
  handlerExclamacao(mensagem: string) {
    this.alertService.mensagemExclamation(mensagem);
  }
  submit() {

    //montando o objeto com os dados   
    let profissionalPagamentoCancelarIn = {
      codigoPagamento: this.formulario.get("codigoPagmento").value,
      codigoUsuario: this.codigoUsuario,
      observacao: this.formulario.get("observacao").value
    } as ProfissionalPagamentoCancelarIn;
    //gravar efetivamente.
    this.alertService.openConfirmModal('Por favor, confirmar se deseja continuar com o cancelamento do pagamento?', 'Apuração - Profissional', (resposta: boolean) => {
      if (resposta) {
        this.inscricao$ = this.profissionalApuracaoPagamentoService.cancelarPagamento(profissionalPagamentoCancelarIn)
                                                                   .subscribe(result=>{
                                                                      if(result){
                                                                        this.handlerSucesso('Pagamento cancelado com sucesso!');
                                                                        this.formulario.reset();
                                                                        this.recuperarListaPagamentos();
                                                                      }
                                                                   },error=>{
                                                                      console.log (error);
                                                                      this.handleError('Ocorreu um erro ao cancelar o pagamento.');
                                                                   });
      }
    }, 'Sim', 'Não');
    //profissionalApuracaoPagamentoService
  }
}
