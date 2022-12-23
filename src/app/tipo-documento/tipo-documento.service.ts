import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BaseService } from '../shared/base.service';
import { TipoDocumento } from './tipo-documento';

@Injectable({
  providedIn: 'root'
})
export class TipoDocumentoService extends BaseService<TipoDocumento>{

  constructor(protected http: HttpClient) {
    super(http,
      `${ environment.API}TipoDocumento`);
  }
}
