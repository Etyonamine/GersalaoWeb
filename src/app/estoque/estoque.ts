import { Produto } from "../produto/produto";

export class Estoque {
    codigoProduto: number;
    dataEntrada: Date;
    valorUnitario: number;
    quantidadeEstoque: number;
    quantidadeVenda: number;
    dataAlteracao: Date;
    produto: Produto;
}