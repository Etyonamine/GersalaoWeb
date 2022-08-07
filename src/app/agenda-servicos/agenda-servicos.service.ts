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

  constructor(protected http : HttpClient) { super(http, `${environment.API}agendas` );}
  url : string = `${environment.API}agendaservicos`;

  quantidadePorProfissional(codigo:number){
    let urlQuantidade = this.url + 'quantidadePorProfissional/'+ codigo.toString();
    return this.http.post(urlQuantidade, null).pipe(take(1));     
  }
}
