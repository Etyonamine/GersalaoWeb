import { Fornecedor } from "../fornecedor/fornecedor";
import { Situacao } from "../situacao/situacao";
import { TipoProduto } from "../tipo-produto/tipo-produto";

export interface Produto{
    codigo: number;
    codigoFornecedor: number;
    codigoChaveFornecedor: string;
    codigoTipoProduto: number;
    codigoSituacao: number;
    codigoLinha: number;
    nome: string;   
    valorComissao:  number;
    observacao: string;
    tipoProduto: TipoProduto;
    situacao: Situacao;    
    fornecedor: Fornecedor;
    
}