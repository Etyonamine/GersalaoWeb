import { HttpClient } from '@angular/common/http';
import { BaseService } from 'src/app/shared/base.service';
import { Injectable } from '@angular/core';
import { ProfissionalTipoServico } from './profissional-tipo-servico';
import { environment } from 'src/environments/environment.prod';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProfissionalTipoServicoService extends BaseService<ProfissionalTipoServico> {

  urlApi = `${environment.API}profissionalTipoServicos`;

  constructor(protected http: HttpClient) {
    super(http, `${environment.API}profissionalTipoServicos` );
  }
  excluirTodos(codigo: number){
    return this.http.delete(`${ this.urlApi  + '/' + codigo }`).pipe(take(1));
  }
}
