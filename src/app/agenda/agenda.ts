import { Cliente } from "../cliente/cliente";
import { Servico } from "../servico/servico";

export class Agenda{
    codigo : number;
    codigoCliente: number;
    codigoProfissional : number;
    codigoServico: number;
    valorServico: number;
    valorComissaoPercentual: number;
    observacao : string;
    data : Date;    
    dataAgendaString:string;
    horaInicial : string;
    horaTermino : string;
    codigoSituacaoServico:number;
    codigoSituacaoBaixa: number;
    dataUsuarioCadastro : Date;
    codigoUsuarioCadastro : number;
    dataUsuarioAlteracao : Date;
    codigoUsuarioAlteracao: number;
    servico: Servico;
    cliente: Cliente;
}