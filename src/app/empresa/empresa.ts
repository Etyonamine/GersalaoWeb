
import { EmpresaContato } from "./empresa-contato";
import { EmpresaEndereco } from "./empresa-endereco";

export interface Empresa{
    codigo: string;
    nome : string;
    nomeAbreviado : string;
    horaInicial: string;
    horaFim: string;
    logo : Array<any>;
    quantidadeMinutosServico: string;
    empresaContato:EmpresaContato;
    empresaEndereco:EmpresaEndereco;
}