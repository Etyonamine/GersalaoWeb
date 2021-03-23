import { UnidadeFederativa } from './../unidade-federativa/unidade-federativa';
export interface Municipio{
    codigo:number;
    descricao:string;    
    codigoUnidadeFederativa:number;
    unidadeFederativa:UnidadeFederativa;
}