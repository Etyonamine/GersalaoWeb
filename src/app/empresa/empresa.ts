import { EmpresaContato } from "./empresa-contato";
import { EmpresaDocumento } from "./empresa-documento";
import { EmpresaEndereco } from "./empresa-endereco";

export interface Empresa{
    codigo: string;
    nome : string;
    nomeAbreviado : string;
    horaInicial: string;
    horaFim: string;
    quantidadeMinutosServico: string;
    empresaContato:EmpresaContato;    
    empresaDocumento: EmpresaDocumento[];
    empresaEndereco:EmpresaEndereco[];
}