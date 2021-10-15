import { Documento } from './../../documento/documento';
export interface ProfissionalDocumento
{
  CodigoProfissional : number;
  CodigoDocumento : number;
  CodigoUsuarioCadastro : number;
  DataCadastro : Date;
  Documento : Documento
}
