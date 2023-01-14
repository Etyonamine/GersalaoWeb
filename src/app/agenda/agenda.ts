import { AgendaPagamentoDetalhe } from "../agenda-pagamento/agenda-pagamento-detalhe/agenda-pagamento-detalhe";
import { AgendaServico } from "../agenda-servicos/agenda-servico";
import { Cliente } from "../cliente/cliente";

export class Agenda{
    codigo : number;
    dataInicio : Date;    
    dataFim : Date;  
    codigoCliente: number;        
    observacao : string;        
    nNumeroComanda: Number;            
    dataCadastro : Date;
    dataAlteracao : Date;
    codigoUsuarioCadastro : number;    
    codigoUsuarioAlteracao: number;    
    cliente: Cliente
    listarServicos: Array<AgendaServico>;
    listaPagamentoDetalhe: AgendaPagamentoDetalhe[];
    css:String;
}