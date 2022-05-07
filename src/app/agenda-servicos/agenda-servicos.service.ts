import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { BaseService } from '../shared/base.service';
import { AgendaServicos } from './agenda-servicos';

@Injectable({
  providedIn: 'root'
})
export class AgendaServicosService extends BaseService<AgendaServicos> {

  constructor(protected http : HttpClient) { super(http, `${environment.API}agendaservicos` );}
  url : string = `${environment.API}agendaservicos`;

  quantidadePorProfissional(codigo:number){
    return this.http.post(`${this.url}?codigoProfissional=${codigo}`, null).pipe(take(1));
     
  }
}
