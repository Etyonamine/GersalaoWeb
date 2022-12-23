import { Produto } from "../produto/produto";

export class Estoque {
    codigoProduto: number;
    dataEntrada: Date;
    valorUnitario: number;
    valorSumarizado: number;
    quantidadeEstoque: number;
    quantidadeVenda: number;
    quantidadeTotal: number;
    dataAlteracao: Date;
    produto: Produto;
}