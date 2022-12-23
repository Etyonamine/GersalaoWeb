import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent implements OnInit {
  @Input() titulo : string = 'Excluir registro';
  @Input() msg : string = '';
  @Input() cancelTxt = 'Cancelar';
  @Input() oKTxt = 'Sim';

  confirmResult: Subject<boolean>;

  constructor(public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: dialog) { }

  ngOnInit(): void {

    this.confirmResult = new Subject();
  }
  onConfirm() {
    this.confirmAndClose(true);

  }

  onClose() {
    this.confirmAndClose(false);

  }
  private confirmAndClose(value: boolean) {

    this.confirmResult.next(value);
     
  }
}

export interface dialog{
  mensagem : string;
  descricaoBotaoOK : string;
  descricaoBotaoCancel : string;
  titulo : string;

}

