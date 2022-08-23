import { Cliente } from "../cliente/cliente";
import { Servico } from "../servico/servico";

export class AgendaApurar{
    codigo: number;
    codigoProfissional: number;
    data: Date;
    valor: number;
    observcaoBaixa: string;
    cliente: Cliente;    
    servico: Servico;
}