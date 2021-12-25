import { CompraDetalhe } from "../compra-detalhe/compra-detalhe";

export interface Compra{
    codigo: number;
    valor: number;
    dataCompra: Date;
    quantidadeProduto: number;
    dataVenctoBoleto: Date;
    dataPagtoBoleto: Date;
    dataCadatro: Date;
    observacao: string;
    listaCompraDetalhe: CompraDetalhe[];
}