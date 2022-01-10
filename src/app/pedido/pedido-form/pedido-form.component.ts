import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pedido-form',
  templateUrl: './pedido-form.component.html',
  styleUrls: ['./pedido-form.component.scss']
})
export class PedidoFormComponent implements OnInit {
  codigoCliente: number;
  codigoPedido: number;

  route: any;

  constructor() { }

  ngOnInit(): void {
    this.codigoCliente = this.route.snapshot.data['codigoCliente'];
    this.codigoPedido = this.route.snapshot.data['codigoPedido'];
  }

}
