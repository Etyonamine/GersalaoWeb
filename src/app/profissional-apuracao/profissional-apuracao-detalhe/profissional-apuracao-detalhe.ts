import { AgendaServico } from "src/app/agenda-servicos/agenda-servico";
import { ProfissionalApuracao } from "../profissional-apuracao";

export class ProfissionalApuracaoDetalhe{
    codigoAgenda : number;
    codigoProfissionalApuracao: number;
    codigoServico: number;
    codigoProfissional: number;
    agendaServico: AgendaServico;
    profissionalApuracao: ProfissionalApuracao;
}