import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BaseService } from '../shared/base.service';
import { Empresa } from './empresa';
import { take } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class EmpresaService extends BaseService<Empresa> {

  constructor(protected http: HttpClient) {
    super(http,`${environment.API}empresas`);
  }
  url = `${environment.API}empresas`;

  recuperarDadosEmpresa(){
    return this.http.get<Empresa>(this.url).pipe(take(1));
  }
}
