import { Situacao } from "../situacao/situacao";

export interface TipoProduto{
    codigo:number;
    nome: string;
    situacao: Situacao;    
}