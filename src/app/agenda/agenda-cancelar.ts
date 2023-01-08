import { AgendaServico } from "../agenda-servicos/agenda-servico";
import { AgendaServicoAdd } from "./agenda-form/agenda-servico-add";

export class AgendaCancelar{
    codigoAgenda: number;
    codigoUsuarioCancelamento: number;    
    campoNomeCliente: string;       
    descricaoMotivoCancelamento: String;
    dataInicio:Date;
    dataFim: Date;    
    codigoMotivoCancelamento: number;
    listaServicos: AgendaServicoAdd[];
}