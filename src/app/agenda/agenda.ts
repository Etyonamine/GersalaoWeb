import { Cliente } from "../cliente/cliente";
import { Profissional } from "../profissional/professional";
import { Servico } from "../servico/servico";

export class Agenda{
    codigo : number;
    codigoCliente: number;
    codigoProfissional : number;
    codigoServico: number;
    codigoFormaPagamento:number;    
    valorServico: number;
    valorDesconto: number;
    valorAcrescimo: number;
    valorComissaoPercentual: number;
    codigoComissaoOrigem: number;
    observacao : string;
    observacaoBaixa : string;
    motivoCancelamento: string;
    data : Date;    
    dataAgendaString:string;
    horaAgendaString:string;
    horaInicial : string;
    horaTermino : string;
    codigoSituacaoServico:number;
    codigoSituacaoBaixa: number;
    codigoSituacaoApuracao:number;
    dataUsuarioCadastro : Date;
    codigoUsuarioCadastro : number;
    dataUsuarioAlteracao : Date;
    codigoUsuarioAlteracao: number;
    dataUsuarioCancelamento : Date;
    codigoUsuarioCancelamento : number;        
    color: string;
    css: string;
    servico: Servico;
    cliente: Cliente;
    profissional: Profissional
}