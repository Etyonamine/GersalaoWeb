<<<<<<< HEAD
import { Injectable } from '@angular/core';
=======
import { HttpClient } from '@angular/common/http';
import { BaseService } from 'src/app/shared/base.service';
import { Injectable } from '@angular/core';
import { ProfissionalTipoServico } from './profissional-tipo-servico';
import { environment } from 'src/environments/environment.prod';
import { take } from 'rxjs/operators';
>>>>>>> c893be033f1accde49973bdbfe9fbdaa9c655d08

@Injectable({
  providedIn: 'root'
})
<<<<<<< HEAD
export class ProfissionalTipoServicoService {

  constructor() { }
=======
export class ProfissionalTipoServicoService extends BaseService<ProfissionalTipoServico> {

  urlApi = `${environment.API}profissionalTipoServicos`;

  constructor(protected http: HttpClient) {
    super(http, `${environment.API}profissionalTipoServicos` );
  }
  excluirTodos(codigo: number){
    return this.http.delete(`${ this.urlApi  + '/' + codigo }`).pipe(take(1));
  }
>>>>>>> c893be033f1accde49973bdbfe9fbdaa9c655d08
}
