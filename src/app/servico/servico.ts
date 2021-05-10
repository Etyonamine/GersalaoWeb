import { TipoServico } from "../tipo-servico/tipo-servico";

export class Servico{
  codigo : number;
  codigoTipoServico : number;
  codigoSituaca : number;
  descricao : string;
  valor : number ;
  dataCadastro : Date;
  codigoUsuarioCadastro : number;
  dataAlteracao : Date;
  codigoUsuarioAlteracao : number;
  tipoServico : TipoServico;
}
