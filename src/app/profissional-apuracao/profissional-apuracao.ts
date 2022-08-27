import { Profissional } from "../profissional/professional";
import { ProfissionalApuracaoDetalhe } from "./profissional-apuracao-detalhe/profissional-apuracao-detalhe";

export class ProfissionalApuracao{
    Codigo : number;
    CodigoProfissional : number;
    DataApuracao : Date;
    DataBaixa : Date;
    DataInicio : Date;
    DataFim : Date;
    ValorTotal : number;
    QuantidadeTotal: number;
    CodigoUsuarioCadastro : number;
    listaApuracaoDetalhe : ProfissionalApuracaoDetalhe[];
    Profissional : Profissional;
}