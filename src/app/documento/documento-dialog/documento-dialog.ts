import { NumberFormatStyle } from '@angular/common';
import { TipoDocumento } from 'src/app/tipo-documento/tipo-documento';
import { Documento } from '../documento';

export class DocumentoDialog {
    codigoProfissional: number;
    tiposDocumento: TipoDocumento[];
    documento: Documento;
  }
