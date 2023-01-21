import { AgendaPagamentoDetalhe } from "../agenda-pagamento/agenda-pagamento-detalhe/agenda-pagamento-detalhe";
import { Profissional } from "../profissional/professional";
import { Servico } from "../servico/servico";
import { Situacao } from "../situacao/situacao";

export class AgendaServico{
    codigoAgenda: number;
    codigoCliente: number;
    codigoProfissional:number;
    codigoCancelamentoServico: number;
    codigoServico: number;
    codigoSituacao: number;
    codigoUsuarioCadatro: number;
    codigoUsuarioAlteracao: number;
    dataCadastro : Date;
    dataAlteracao: Date;
    dataCancelamento: Date;
    valorServico: number;
    valorPercentualComissao:number;
    dataAgenda: Date;    
    observacao: string;   
    observacaoCancelamento:string; 
    profissional: Profissional;
    servico: Servico;
    situacao: Situacao;
    listaPagamentoDetalhe: AgendaPagamentoDetalhe[]

}