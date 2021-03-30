import { ClienteContato } from './../cliente-contato/cliente-contato';
import { ClienteEndereco } from './../cliente-endereco/cliente-endereco';

export interface Cliente{
    codigo:number;
    codigousuariocadastro: number;
    codigousuarioalteracao:number;
    codigosituacao:number;  
    nome:string;
    dataaniversario:Date;    
    dataalteracao:Date;
    datacadastro:Date;    

    clienteenderecos:ClienteEndereco[];  
    clientecontatos:ClienteContato[];    
}