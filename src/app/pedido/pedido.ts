import { Cliente } from "../cliente/cliente";

export class Pedido{
    codigo: number;
    codigoCliente: number;
    dataPedido:Date;
    valorTotal: number;
    quantidadeTotal: number;
    observacao: string;
    dataFechamento: Date;
    cliente: Cliente;
}