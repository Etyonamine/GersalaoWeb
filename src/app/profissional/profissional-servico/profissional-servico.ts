import { Servico } from './../../servico/servico';
import { Profissional } from "../professional";

export class ProfissionalServico{
  codigoProfissional : number;
  codigoServico : number;
  valor : number;
  percentualComissao : number;
  dataCadastro : Date;
  codigoUsuarioCadastro : number;
  profissional : Profissional;
  servico : Servico;
}
