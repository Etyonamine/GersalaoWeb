import { Documento } from '../../documento/documento';

export interface ClienteDocumento {
  codigoCliente: number;
  codigoDocumento: number;
  Documento: Documento;
}
