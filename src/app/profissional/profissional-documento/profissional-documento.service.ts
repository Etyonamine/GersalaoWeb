import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';
import { BaseService } from 'src/app/shared/base.service';
import { environment } from 'src/environments/environment';
import { ProfissionalDocumento } from './profissional-documento';

@Injectable({
  providedIn: 'root'
})
export class ProfissionalDocumentoService extends BaseService<ProfissionalDocumento>{

  constructor(protected http: HttpClient ) {
    super(http, `${environment.API}profissionalDocumento`);
  }
  urlApi = `${environment.API}profissionalDocumento`;

  Excluir(recurso: ProfissionalDocumento) {
    return this.http.delete(`${ this.urlApi  + '/' + recurso.codigoProfissional + '/' + recurso.codigoDocumento }`).pipe(take(1));
  }
}