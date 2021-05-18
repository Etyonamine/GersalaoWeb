import { TipoServico } from "../tipo-servico/tipo-servico";
import { Situacao } from "../situacao/situacao";
export class Servico{
  codigo : number;
  codigoTipoServico : number;
  codigoSituacao : number;
  descricao : string;
  valor : number ;
  dataCadastro : Date;
  codigoUsuarioCadastro : number;
  dataAlteracao : Date;
  codigoUsuarioAlteracao : number;
  tipoServico : TipoServico;
  situacao : Situacao ;
}
