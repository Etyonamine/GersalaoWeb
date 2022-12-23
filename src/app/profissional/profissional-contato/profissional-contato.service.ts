import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';
import { BaseService } from 'src/app/shared/base.service';
import { environment } from 'src/environments/environment';
import { Profissional } from '../professional';
import { ProfissionalContato } from './profissional-contato';

@Injectable({
  providedIn: 'root'
})
export class ProfissionalContatoService  extends BaseService<ProfissionalContato> {

  constructor(protected http: HttpClient) {
    super(http, `${environment.API}profissionalContato` );
  }
  urlApi = `${environment.API}profissionalContato`;
  ListaPorProfissional(codigoProfissional: number){
    let urlpesq  = this.urlApi + '/' + `${codigoProfissional}`;
    return this.http.get<ProfissionalContato[]>(urlpesq).pipe(take(1));
  }
  ExcluirLista(lista: ProfissionalContato[]) {
    lista.forEach (registro => {
      this.http.delete(`${ this.urlApi  + '/' + registro.codigoProfissional + '/' + registro.codigoContato }`).pipe(take(1));
    });
    return true;
  }

  Excluir(recurso: ProfissionalContato) {
    return this.http.delete(`${ this.urlApi  + '/' + recurso.codigoProfissional + '/' + recurso.codigoContato }`).pipe(take(1));
  }
  ExcluirTodos(listaContatos: ProfissionalContato[]) {
    let url = this.urlApi + '/ExcluirTodosPorProfissional'
    return this.http.request('delete', url, {body: listaContatos})
  }
}
