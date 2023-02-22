import { Profissional } from "../profissional/professional";
import { Situacao } from "../situacao/situacao";
import { Usuario } from "../usuario/usuario";
import { ProfissionalApuracaoDetalhe } from "./profissional-apuracao-detalhe/profissional-apuracao-detalhe";

export class ProfissionalApuracao{
    codigo : number;    
    dataApuracao : Date;
    dataBaixa : Date;
    dataInicio : Date;
    dataFim : Date;
    valorTotal : number;
    quantidadeTotal: number;
    codigoUsuarioCadastro : number;
    codigoSituacao: number;
    listaApuracaoDetalhe : ProfissionalApuracaoDetalhe[];
    profissional : Profissional;
    usuario:Usuario;
    usuarioCadastro: Usuario;
    situacao: Situacao;
}