import { TipoContato } from "../tipo-contato/tipo-contato";

export interface Contato {
  codigo: number;
  codigoTipoContato: number;
  codigosituacao: number;
  descricao: string;
  dataCadastro: Date;
  codigoUsuarioCadastrado: number;
  dataAlteracao: Date;
  codigoUsuarioAlteracao: number;
  tipoContato: TipoContato;
}
