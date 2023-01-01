import { AgendaServico } from "../agenda-servicos/agenda-servico";
import { Cliente } from "../cliente/cliente";

export class Agenda{
    Codigo : number;
    DataInicio : Date;    
    DataFim : Date;  
    CodigoCliente: number;        
    Observacao : string;        
    NumeroComanda: Number;            
    DataCadastro : Date;
    DataAlteracao : Date;
    CodigoUsuarioCadastro : number;    
    CodigoUsuarioAlteracao: number;    
    Cliente: Cliente
    ListarServicos: Array<AgendaServico>;

}