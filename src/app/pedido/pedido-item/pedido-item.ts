import { Cliente } from "src/app/cliente/cliente";
import { Produto } from "src/app/produto/produto";
import { Pedido } from "../pedido";

export class PedidoItem{
    codigo: number;
    codigoPedido: number;    
    codigoProduto: number;
    valorCusto: number;
    valorVenda: number;
    quantidade: number;
    numeroPedido: string;
    dataCadastro: Date;
    dataAlteracao:Date;
    pedido: Pedido;    
    produto: Produto;

}