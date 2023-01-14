import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AgendaServicoAdd } from '../agenda/agenda-form/agenda-servico-add';
import { BaseFormComponent } from '../shared/base-form/base-form.component';
import { AgendaPagamento } from './agenda-pagamento';

@Component({
  selector: 'app-agenda-pagamento',
  templateUrl: './agenda-pagamento.component.html',
  styleUrls: ['./agenda-pagamento.component.scss']
})
export class AgendaPagamentoComponent extends BaseFormComponent implements OnInit {
  formulario: FormGroup;
  agendaPagamentoServico: AgendaPagamento;
  //manipulacao da tabela
  displayedColumns: string[] = ['select', 'item', 'nomeProfissional', 'nomeServico', 'valorServico','descricaoSituacao','observacao', 'action'];
  dataSource = new MatTableDataSource<AgendaServicoAdd>();

  constructor(@Inject(MAT_DIALOG_DATA) public data: AgendaPagamento) {
    super();
  }
  ngOnInit(): void {
      this.agendaPagamentoServico  = this.data;
  }
  submit() {
    throw new Error('Method not implemented.');
  }

}
