import { AgendaServico } from "../agenda-servicos/agenda-servico";

export class AgendaGravarNovo{    
    Data: string;    
    HoraInicio: string;    
    HoraFim: string;
    CodigoCliente: number;    
    Observacao: string;    
    NumeroComanda: number;    
    CodigoUsuarioCadastro: number;
    Servicos: Array<AgendaServico>;  
}