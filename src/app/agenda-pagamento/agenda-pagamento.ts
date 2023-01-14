import { AgendaServico } from "../agenda-servicos/agenda-servico";

export interface AgendaPagamento{
    codigoAgenda:number;
    agendaServico: AgendaServico;
}