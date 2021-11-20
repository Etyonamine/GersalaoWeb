import { Situacao } from "../situacao/situacao";

export interface ProdutoLinha {
    codigo: number;
    codigoSituacao: number;
    nome: string;
    situacao: Situacao;
}