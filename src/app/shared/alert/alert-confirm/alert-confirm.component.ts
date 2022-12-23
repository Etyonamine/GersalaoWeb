import { Component, OnInit, Inject } from '@angular/core';

import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-confirm',
  templateUrl: './alert-confirm.component.html',
  styleUrls: ['./alert-confirm.component.scss']
})
export class AlertConfirmComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: ModalConfirmData
  ) { }

}

export class ModalConfirmData {
  title: string;
  content: string;
  confirmButtonLabel: string;
  closeButtonLabel: string;


  constructor(data?) {
    if (data) {
      this.title = data.title;
      this.content = data.content;
      this.confirmButtonLabel = data.confirmButtonLabel;
      this.closeButtonLabel = data.closeButtonLabel;
       
    }
  }
}
