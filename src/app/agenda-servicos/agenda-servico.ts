import { Profissional } from "../profissional/professional";
import { Servico } from "../servico/servico";
import { Situacao } from "../situacao/situacao";

export class AgendaServico{
    codigoAgenda: number;
    codigoCliente: number;
    codigoProfissional:number;
    codigoServico: number;
    codigoSituacao: number;
    codigoUsuarioCadatro: number;
    codigoUsuarioAlteracao: number;
    dataCadastro : Date;
    dataAlteracao: Date;
    valorServico: number;
    valorPercentualComissao:number;
    dataAgenda: Date;    
    observacao: string;    
    profissional: Profissional;
    servico: Servico;
    situacao: Situacao;

}