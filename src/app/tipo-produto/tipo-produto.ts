import { Situacao } from "../situacao/situacao";

export interface TipoProduto{
    codigo:number;
    codigoSituacao:number;
    nome: string;
    situacao: Situacao;    
}