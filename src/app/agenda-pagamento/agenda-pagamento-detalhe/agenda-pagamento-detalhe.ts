import { AgendaServico } from "src/app/agenda-servicos/agenda-servico";
import { Agenda } from "src/app/agenda/agenda";
import { Profissional } from "src/app/profissional/professional";
import { Servico } from "src/app/servico/servico";

export class AgendaPagamentoDetalhe{
    codigoAgendaPagamento: number;
    codigoAgenda: number;
    codigoProfissional: number;
    codigoServico: number;
    dataCadastro: Date;
    dataAlteracao: Date;
    codigoUsuarioCadastro: number;
    codigoUsuarioAlteracao: number;
    codigoSituacaoApuracao: number;
    profissional: Profissional;
    servico: Servico;
    agendaServico: AgendaServico;
}