import { CompraDetalhe } from "../compra-detalhe/compra-detalhe";

export interface Compra{
    codigo: number;
    valor: number;
    dataCompra: Date;
    quantidadeProduto: number;
    dataVenctoBoleto: Date;
    dataPagtoBoleto: Date;
    dataCadastro: Date;
    observacao: string;
    listaCompraDetalhe: CompraDetalhe[];
}