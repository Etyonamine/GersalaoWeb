import { ClienteEndereco } from './../cliente-endereco/cliente-endereco';
import { Situacao } from './../situacao/situacao';

export interface Cliente{
    codigo:number;
    nome:string;
    aniversario:Date;
    datacadastro:Date;
    codigousuariocadastro: number;
    dataalteracao:Date;
    coodigousuarioalteracao:number;
    codigosituacao:number;  
    listaClienteEnderecos:ClienteEndereco[];  
}