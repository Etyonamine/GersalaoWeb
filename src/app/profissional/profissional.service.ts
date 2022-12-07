import { Profissional } from './professional';
import { environment } from 'src/environments/environment';

import { HttpClient } from '@angular/common/http';
import { BaseService } from './../shared/base.service';
import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';

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
  
}
