import { Profissional } from "../profissional/professional";
import { ProfissionalApuracaoDetalhe } from "./profissional-apuracao-detalhe/profissional-apuracao-detalhe";

export class ProfissionalApuracao{
    codigo : number;
    codigoProfissional : number;
    dataApuracao : Date;
    dataBaixa : Date;
    dataInicio : Date;
    dataFim : Date;
    valorTotal : number;
    quantidadeTotal: number;
    codigoUsuarioCadastro : number;
    listaApuracaoDetalhe : ProfissionalApuracaoDetalhe[];
    profissional : Profissional;
}