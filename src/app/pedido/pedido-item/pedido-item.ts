import { Cliente } from "src/app/cliente/cliente";
import { Produto } from "src/app/produto/produto";
import { Pedido } from "../pedido";

export class PedidoItem{
    codigo: number;
    codigoPedido: number;
    codigoCliente: number;
    codigoProduto: number;
    valorCusto: number;
    valorVenda: number;
    quantidade: number;
    dataCadastro: Date;
    dataAlteracao:Date;
    pedido: Pedido;
    cliente: Cliente;
    produto: Produto;

}