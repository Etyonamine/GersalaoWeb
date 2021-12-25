import { Produto } from "../produto/produto";

export interface CompraDetalhe{
    codigo: number;
    codigoCompra: number;
    codigoProduto: number;
    valorUnitario: number;
    quantidadeProduto: number; 
    produto: Produto;   
    dataCadastro: Date;
}