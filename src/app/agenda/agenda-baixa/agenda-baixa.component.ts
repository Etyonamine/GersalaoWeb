import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { BaseFormComponent } from 'src/app/shared/base-form/base-form.component';
import { AgendaBaixa } from '../agenda-baixa';
import { AgendaService } from '../agenda.service';

@Component({
  selector: 'app-agenda-baixa',
  templateUrl: './agenda-baixa.component.html',
  styleUrls: ['./agenda-baixa.component.scss']
})
export class AgendaBaixaComponent  extends BaseFormComponent implements OnInit,OnDestroy {
  submit() {
    throw new Error('Method not implemented.');
  }

  statusBaixado:boolean;
  agenda: AgendaBaixa;
  inscricaoAgenda$: Subscription;

    constructor(@Inject(MAT_DIALOG_DATA) public data: AgendaBaixa,               
             private dialogRef: MatDialogRef<AgendaBaixaComponent>,
             private alertService: AlertService,
             private agendaService: AgendaService) { super(); }

  ngOnInit(): void {
    this.agenda = this.data;     
    this.statusBaixado = this.agenda.situacaoBaixado;
  }  
  ngOnDestroy():void{
    if(this.inscricaoAgenda$){
      this.inscricaoAgenda$.unsubscribe();
    }
  }
  baixar(){

    //validações
    //valor acrescimo
    if (this.agenda.valorDesconto.toString().trim()===''||this.agenda.valorDesconto === null){
      
      this.handleError('Por favor, verifique o campo de valor de desconto está vazio!');
      return;
    } else{
      this.agenda.valorDesconto = Number.parseFloat(this.agenda.valorDesconto.toString().replace(',','.'));
    }
    if (this.agenda.valorAcrescimo.toString().trim()===''||this.agenda.valorAcrescimo === null){
      this.handleError('Por favor, verifique o campo de valor de acréscimo está vazio!');
      return;
    }else{
      this.agenda.valorAcrescimo = Number.parseFloat(this.agenda.valorAcrescimo.toString().replace(',','.'));
    }
    
    let dataCorrente = new Date();
    //validar dia de baixa vs data de agenda.
    if ( new Date(this.agenda.data.toString().substring(0,10))> dataCorrente){
      this.handleError('Não pode ser baixado o serviço antes da data de execução!');
      return;
    }

    this.alertService.openConfirmModal('Por favor, confirmar se deseja continuar com a baixa de agendamento?', 'Baixa - Agendamento', (resposta: boolean) => {
      if (resposta) {
        this.agenda.dataUsuarioAlteracao = this.dataHoraAtualSemTimeZone();
        this.inscricaoAgenda$ = this.agendaService.baixaAgendamento(this.agenda)
                                                  .subscribe(result=>{
                                                    if (result){
                                                      this.handlerSucesso('Baixado com sucesso!')
                                                      setTimeout(() => {
                                                        this.onNoClick();  
                                                      }, 3000);                                                      
                                                    }else
                                                    {
                                                      this.handleError('Houve algum erro na tentativa de baixa do agendamento.')
                                                    }
                                                  },error=>{
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
  
		const charCode = e.which ? e.which : e.keyCode;
		if (charCode !== 190 && charCode !== 46 && charCode!==44){
      if (charCode > 31  && (charCode < 48 || charCode > 57)) {
        this.handleError("Por favor, informar apenas numeros e casas decimais");        
      }
    }	 
	}
  onNoClick(): void {
    this.dialogRef.close();
  }  
}
