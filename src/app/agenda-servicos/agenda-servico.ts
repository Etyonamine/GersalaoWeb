import { Profissional } from "../profissional/professional";
import { Servico } from "../servico/servico";
import { Situacao } from "../situacao/situacao";

export class AgendaServico{
    codigoCliente: number;
    codigoProfissional:number;
    codigoServico: number;
    codigoSituacao: number;
    valorServico: number;
    valorPercentualComissao:number;
    dataAgenda: Date;    
    observacao: string;
    profissional: Profissional;
    servico: Servico;
    situacao: Situacao;

}