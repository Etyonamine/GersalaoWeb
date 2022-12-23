import { Cliente } from "../cliente/cliente";
import { PedidoItem } from "./pedido-item/pedido-item";

export class Pedido{
    codigo: number;
    codigoCliente: number;
    codigoStatus: number;
    dataPedido:Date;
    valorTotal: number;
    quantidadeTotal: number;
    observacao: string;
    dataFechamento: Date;
    dataCancelamento: Date;
    dataAlteracao: Date;
    motivoCancelamento: string;
    numeroPedido: string;
    nomeCliente: string;
    situacao: string;
    cliente: Cliente;
    listaPedidoItem: Array<PedidoItem> =[];
}