import { AgendaServico } from "../agenda-servicos/agenda-servico";

export class AgendaIn {
    Data: string;    
    HoraInicio: string;    
    HoraFim: string;
    CodigoCliente: number;    
    Observacao: string;
    Servicos: Array<AgendaServico>;
}