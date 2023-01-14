import { AgendaPagamentoDetalhe } from "./agenda-pagamento-detalhe/agenda-pagamento-detalhe";

export interface AgendaPagamento{
    codigo:number;
    codigoFormaPagamento: number;
    codigoSituacao: number;
    valorPagamento: number;
    valorDesconto: number;
    valorAcrescimo: number;
    Observacao: string;
    codigoUsuarioCadastro: number;
    codigousuarioAlteracao: number;
    dataCadastro: Date;
    dataAlteracao: Date;
    listaDetalhes: AgendaPagamentoDetalhe[]
}