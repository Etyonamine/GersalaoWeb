import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { FormaPagamento } from 'src/app/forma-pagamento/forma-pagamento';
import { FormaPagamentoService } from 'src/app/forma-pagamento/forma-pagamento.service';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { BaseFormComponent } from 'src/app/shared/base-form/base-form.component';
import { ValidaNumeroService } from 'src/app/shared/service/valida-numero.service';
import { AgendaBaixa } from '../agenda-baixa';
import { AgendaService } from '../agenda.service';

@Component({
  selector: 'app-agenda-baixa',
  templateUrl: './agenda-baixa.component.html',
  styleUrls: ['./agenda-baixa.component.scss']
})
export class AgendaBaixaComponent extends BaseFormComponent implements OnInit, OnDestroy {
  submit() {
    throw new Error('Method not implemented.');
  }
  situacaoAgendamento: string;
  statusBaixado: boolean;
  statusPendente: boolean;
  optionFormaPagamento: Array<FormaPagamento>;
  agenda: AgendaBaixa;
  inscricaoAgenda$: Subscription;
  inscricaoFormaPagto$: Subscription;

  saldoFinal: number;
  


  constructor(@Inject(MAT_DIALOG_DATA) public data: AgendaBaixa,
    private dialogRef: MatDialogRef<AgendaBaixaComponent>,
    private alertService: AlertService,
    private agendaService: AgendaService,
    private validaNumeroService: ValidaNumeroService,
    private formaPagtoService: FormaPagamentoService) { super(); }

  ngOnInit(): void {
    
    this.agenda = this.data;
    this.statusBaixado = this.agenda.situacaoBaixado;
    this.statusPendente = this.agenda.situacaoCancelado || this.agenda.situacaoBaixado ? false : true;
    this.calcularSaldo();
    this.IdentificarSituacaoAgendamento();
     this.listarFormasPagto()

  }

  IdentificarSituacaoAgendamento() {
    this.situacaoAgendamento = 'Pendente';
    if (this.agenda.situacaoBaixado) {
      this.situacaoAgendamento = 'Concluído';
    }
  }

  ngOnDestroy(): void {
    if (this.inscricaoAgenda$) {
      this.inscricaoAgenda$.unsubscribe();
    }
    if (this.inscricaoFormaPagto$){
      this.inscricaoFormaPagto$.unsubscribe();
    }
  }
  calcularSaldo() {
    let valorServico = Number.parseFloat(this.agenda.valorServico.toString());
    let valorAcrescimo = Number.parseFloat(this.agenda.valorAcrescimo.toString());
    let valorDesconto = Number.parseFloat(this.agenda.valorDesconto.toString());

    this.saldoFinal = ((valorServico + valorAcrescimo) - valorDesconto);
  }
  baixar() {

    //validações
    //forma de pagamento
    if (this.agenda.codigoFormaPagamento === null || this.agenda.codigoFormaPagamento === undefined){
      this.handleError('Por favor, informe uma forma de pagamento!');
      return;
    }else{
      if (this.agenda.codigoFormaPagamento === 0 ){
        this.handleError('Por favor, informe uma forma de pagamento!');
        return;
      }
    }
    //valor acrescimo
    if (this.agenda.valorDesconto.toString().trim() === '' || this.agenda.valorDesconto === null) {

      this.handleError('Por favor, verifique o campo de valor de desconto está vazio!');
      return;
    } else {
      if (!this.validaNumeroService.somenteNumeroEVirgulaEPonto(this.agenda.valorDesconto.toString().replace(',', '.'))) {
        this.handleError('Valor de desconto inválido!')
        return;
      }
      this.agenda.valorDesconto = Number.parseFloat(this.agenda.valorDesconto.toString().replace(',', '.'));
    }
    if (this.agenda.valorAcrescimo.toString().trim() === '' || this.agenda.valorAcrescimo === null) {
      this.handleError('Por favor, verifique o campo de valor de acréscimo está vazio!');
      return;
    } else {
      if (!this.validaNumeroService.somenteNumeroEVirgulaEPonto(this.agenda.valorAcrescimo.toString().replace(',', '.'))) {
        this.handleError('Valor de acréscimo inválido!')
        return;
      }
      this.agenda.valorAcrescimo = Number.parseFloat(this.agenda.valorAcrescimo.toString().replace(',', '.'));
    }

    // valida valores preenchidos.
    if (((this.agenda.valorServico + this.agenda.valorAcrescimo) - (this.agenda.valorDesconto)) < 0) {
      this.handleError('O saldo final dos valores (serviço + acréscimo - desconto) ficou negativo! Não é possível continuar.');
      return;
    }

    let dataCorrente = new Date();
    //validar dia de baixa vs data de agenda.
    if (new Date(this.agenda.data.toString().substring(0, 10)) > dataCorrente) {
      this.handleError('Não pode ser baixado o serviço antes da data de execução!');
      return;
    }

    this.alertService.openConfirmModal('Por favor, confirmar se deseja continuar com a baixa de agendamento?', 'Baixa - Agendamento', (resposta: boolean) => {
      if (resposta) {
        this.agenda.dataUsuarioAlteracao = this.dataHoraAtualSemTimeZone();
        this.inscricaoAgenda$ = this.agendaService.baixaAgendamento(this.agenda)
          .subscribe(result => {
            if (result) {
              this.handlerSucesso('Baixado com sucesso!')
              setTimeout(() => {
                this.onNoClick();
              }, 3000);
            } else {
              this.handleError('Houve algum erro na tentativa de baixa do agendamento.')
            }
          }, error => {
            console.log(error);
            this.handleError('Ocorreu um erro na transmissão da baixa de agendamento.');
          })
      }
    }, 'Sim', 'Não'
    );

  }
  handlerSucesso(mensagem: string) {
    this.alertService.mensagemSucesso(mensagem);
  }
  handleError(mensagem: string) {
    this.alertService.mensagemErro(mensagem);
  }
  allowNumericDigitsOnlyOnKeyUp(e) {
    if (this.statusBaixado) {
      return;
    }
    const charCode = e.which ? e.which : e.keyCode;
    if (charCode !== 190 && charCode !== 46 && charCode !== 44) {
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        this.handleError("Por favor, informar apenas numeros e casas decimais");
        return;
      }
      this.calcularSaldo();
    }

  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  listarFormasPagto(){
    this.inscricaoFormaPagto$ = this.formaPagtoService.list<FormaPagamento[]>().subscribe(result=>{
      this.optionFormaPagamento = result;
    },
    error=>{
      console.log(error);
    });
  }
}
