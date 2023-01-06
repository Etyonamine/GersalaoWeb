import { AgendaServico } from "src/app/agenda-servicos/agenda-servico";

export class AgendaServicoAdd{
    item: number;
    codigoAgenda: number;
    codigoProfissional: number;
    codigoServico: number;
    observacao: string;
    nomeProfissional: string;
    nomeServico: string;
    codigoSituacao: number;
    descricaoSituacao: string;
    valorServico: number;
    agendaServico: AgendaServico;
}