import { Documento } from './../../documento/documento';
export interface ProfissionalDocumento
{
  codigoProfissional: number;
  codigoDocumento: number;
  codigoUsuarioCadastro: number;
  dataCadastro: Date;
  documento: Documento;
}
