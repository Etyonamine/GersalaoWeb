import { Profissional } from './professional';
import { environment } from 'src/environments/environment';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BaseService } from './../shared/base.service';
import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';
import { ProfissionalViewModel } from './profissionalViewModel';

@Injectable({
  providedIn: 'root'
})
export class ProfissionalService extends BaseService<Profissional>{

  constructor(protected http : HttpClient ) {
    super(http, `${environment.API}profissional` );
  }
  url : string = `${environment.API}profissional`;

  Atualizar(recurso: Profissional){
    return this.http.put(this.url, recurso).pipe(take(1));
  }
  AtualizarValorComissao(valor: number, codigoProfissional: number){

    let urlComissao = this.url + '/AtualizarComissao';  
    let codigoProfisssionalCripto = btoa(codigoProfissional.toString()) 
    let valorComissaoCripto = btoa(valor.toString());

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return this.http.post<boolean>(urlComissao,{codigo : codigoProfisssionalCripto, valor: valorComissaoCripto},httpOptions ).pipe(take(1)); 
  }
  ListarProfissionais(){
    let urlListar = this.url + '/listarProfissional';
    return this.http.post<ProfissionalViewModel[]>(urlListar, null).pipe(take(1));
  }
}
