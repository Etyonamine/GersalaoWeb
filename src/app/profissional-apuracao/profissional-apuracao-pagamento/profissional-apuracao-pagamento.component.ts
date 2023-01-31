import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-profissional-apuracao-pagamento',
  templateUrl: './profissional-apuracao-pagamento.component.html',
  styleUrls: ['./profissional-apuracao-pagamento.component.scss']
})
export class ProfissionalApuracaoPagamentoComponent implements OnInit {
  
  constructor(@Inject(MAT_DIALOG_DATA) public codigoApuracao: number) { }

  ngOnInit(): void {
  }

}
