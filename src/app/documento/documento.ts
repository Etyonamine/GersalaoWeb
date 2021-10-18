import { TipoDocumento } from './../tipo-documento/tipo-documento';
export interface Documento{
  codigo:number;
  codigoTipoDocumento :number;
  codigoSituacao :number;
  descricao:string;
  dataCadastro:Date;
  codigoUsuarioCadastro :number;
  dataAlteracao:Date;
  codigoUsuarioAlteracao:number;
  tipoDocumento: TipoDocumento;
}
