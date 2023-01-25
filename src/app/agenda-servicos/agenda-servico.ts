import { AgendaPagamentoDetalhe } from "../agenda-pagamento/agenda-pagamento-detalhe/agenda-pagamento-detalhe";
import { Agenda } from "../agenda/agenda";
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
    codigoOrigemComissao: number;
    dataCadastro : Date;
    dataAlteracao: Date;
    dataCancelamento: Date;
    valorServico: number;
    valorPercentualComissao:number;
    dataAgenda: Date;    
    observacao: string;   
    observacaoCancelamento:string; 
    agenda: Agenda;
    profissional: Profissional;
    servico: Servico;
    situacao: Situacao;
    listaPagamentoDetalhe: AgendaPagamentoDetalhe[]

}