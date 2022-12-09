import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlternativeServiceOptions } from 'http2';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { BaseFormComponent } from 'src/app/shared/base-form/base-form.component';
import { threadId } from 'worker_threads';
import { AgendaAlertBaixaCancelamentoComponent } from '../agenda-alert-baixa-cancelamento/agenda-alert-baixa-cancelamento.component';
import { AgendaCancelar } from '../agenda-cancelar';
import { AgendaService } from '../agenda.service';

@Component({
  selector: 'app-agenda-cancelamento',
  templateUrl: './agenda-cancelamento.component.html',
  styleUrls: ['./agenda-cancelamento.component.scss']
})
export class AgendaCancelamentoComponent extends BaseFormComponent implements OnInit {
  submit() {
    throw new Error('Method not implemented.');
  }
  agenda: AgendaCancelar;
  statusCancelamento: boolean;
  descricaoSituacao: string;
  inscricaoCancelar$: Subscription;
  dataAgenda: Date;

  constructor(
              @Inject(MAT_DIALOG_DATA)
              public data: AgendaCancelar, 
              private agendaService:AgendaService,
              private alertService: AlertService,
              private dialogRef: MatDialogRef<AgendaCancelamentoComponent>) { super(); }

  ngOnInit(): void {
    this.agenda = this.data;
    this.statusCancelamento = this.data.situacao;
    this.dataAgenda = this.data.data;
    this.identificarSituacao();
  }
  ngOnDestroy():void{
    if(this.inscricaoCancelar$){
      this.inscricaoCancelar$.unsubscribe();
    }
  }
  identificarSituacao(){
    switch(this.data.codigoSituacao)
    {
      case 4://concluido
        this.descricaoSituacao = 'Concluído';
        break;
      case 7://cancelado
        this.descricaoSituacao = 'Cancelado';
        break;
      default:        
        this.descricaoSituacao = 'Pendente';
        break;
    }
  }
  cancelar()
  {
    if (this.agenda.motivoCancelamento === undefined || this.agenda.motivoCancelamento === null){
       this.handleError('Por favor, informar o motivo do cancelamento!');
       return;
    }else if (this.agenda.motivoCancelamento.trim()===''){
      this.handleError('Por favor, informar o motivo do cancelamento!');
      return;
    }
    
    let agendaCancelar = this.agenda;
    agendaCancelar.dataCancelamento = this.dataHoraAtualSemTimeZone();
    this.alertService.openConfirmModal('Por favor, confirmar se deseja continuar com o cancelamento da agendamento?', 'Cancelar - Agendamento', (resposta: boolean) => {
      if (resposta) {
    //agendaCancelar.dataCancelamento 
    this.inscricaoCancelar$= this.agendaService.cancelarAgendamento(agendaCancelar)
                                               .subscribe(result=>{
                                                if(result){
                                                  this.handlerSucesso('Agendamento cancelado com sucesso!');
                                                  setTimeout(() => {
                                                    this.onNoClick();
                                                  }, 3000);
                                                }
                                               },
                                               error=>{
                                                console.log(error);
                                                this.handleError('Ocorreu um erro ao tentar cancelar o agendamento.');
                                               });
    }}, 'Sim', 'Não'
    );
  }
  handlerSucesso(mensagem: string) {
    this.alertService.mensagemSucesso(mensagem);
  }
  handleError(mensagem: string) {
    this.alertService.mensagemErro(mensagem);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }  
}

