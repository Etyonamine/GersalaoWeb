import { Component, Inject, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Agenda } from '../agenda';
 

@Component({
  selector: 'app-agenda-alert-baixa-cancelamento',
  templateUrl: './agenda-alert-baixa-cancelamento.component.html',
  styleUrls: ['./agenda-alert-baixa-cancelamento.component.scss']
})
export class AgendaAlertBaixaCancelamentoComponent implements OnInit {
  dataAgenda:string;
  constructor(
              @Inject(MAT_DIALOG_DATA)
             public data: ModalConfirmData){ }

  ngOnInit(): void {
    this.dataAgenda = this.data.agenda.dataInicio.toLocaleString('BRL');
  }
  

}
export class ModalConfirmData {
  title: string;
  content: string;
  baixaButtonLabel: string;
  cancelarButtonLabel: string;
  closeButtonLabel: string;
  
  agenda: Agenda;


  constructor(data?) {
    if (data) {
      this.title = data.title;
      this.content = data.content;
      this.baixaButtonLabel = data.baixaButtonLabel;
      this.cancelarButtonLabel = data.cancelarButtonLabel;
      this.closeButtonLabel = data.closeButtonLabel;
      this.agenda = data.agenda;
      
       
    }
  }
}