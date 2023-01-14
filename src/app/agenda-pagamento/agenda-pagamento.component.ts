import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BaseFormComponent } from '../shared/base-form/base-form.component';
import { AgendaPagamento } from './agenda-pagamento';

@Component({
  selector: 'app-agenda-pagamento',
  templateUrl: './agenda-pagamento.component.html',
  styleUrls: ['./agenda-pagamento.component.scss']
})
export class AgendaPagamentoComponent extends BaseFormComponent implements OnInit {
  submit() {
    throw new Error('Method not implemented.');
  }

  constructor(@Inject(MAT_DIALOG_DATA) public data: AgendaPagamento) {
    super();
  }

  ngOnInit(): void {
  }

}
