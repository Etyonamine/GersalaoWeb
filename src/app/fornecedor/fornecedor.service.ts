import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { BaseService } from '../shared/base.service';
import { Fornecedor } from './fornecedor';

@Injectable({
  providedIn: 'root'
})
export class FornecedorService extends BaseService<Fornecedor> {
  url: string = `${environment.API}fornecedores`;;

  constructor(protected http:HttpClient) {
    super(http, `${ environment.API}fornecedores`);
   }

   listar(){
     let urlLista = this.url + '/Lista';
     return this.http.get<Fornecedor[]>(urlLista).pipe(take(1));
   }
}
