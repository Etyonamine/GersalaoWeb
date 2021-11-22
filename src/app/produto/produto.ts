import { Situacao } from "../situacao/situacao";
import { TipoProduto } from "../tipo-produto/tipo-produto";

export interface Produto{
    codigo: number;
    codigoFornecedor: number;
    codigoSituacao: number;
    nome:string;   
    observacao:string;
    tipoProduto: TipoProduto;
    situacao: Situacao;    
}