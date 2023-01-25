import { Agenda } from "src/app/agenda/agenda";
import { ProfissionalApuracao } from "../profissional-apuracao";

export class ProfissionalApuracaoDetalhe{
    codigoAgenda : number;
    codigoProfissionalApuracao: number;
    codigoServico: number;
    codigoProfissional: number;
    agenda: Agenda;
    profissionalApuracao: ProfissionalApuracao;
}