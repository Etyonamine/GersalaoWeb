import { Time } from "@angular/common";
import * as internal from "stream";
import { EmpresaContato } from "./empresa-contato";
import { EmpresaEndereco } from "./empresa-endereco";

export interface Empresa{
    codigo: string;
    nome : string;
    nomeAbreviado : string;
    horaInicial: string;
    horaFim: string;
    quantidadeMinutosServico: string;
    empresaContato:EmpresaContato;
    empresaEndereco:EmpresaEndereco;
}