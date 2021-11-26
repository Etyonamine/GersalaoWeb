import { Situacao } from "../situacao/situacao";
import { TipoProduto } from "../tipo-produto/tipo-produto";

export interface Produto{
    codigo: number;
    codigoFornecedor: number;
    codigoTipoProduto: number;
    codigoSituacao: number;
    codigoLinha: number;
    nome:string;   
    observacao:string;
    tipoProduto: TipoProduto;
    situacao: Situacao;    
    
}