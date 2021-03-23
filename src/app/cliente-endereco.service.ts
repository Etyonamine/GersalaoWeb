import { ApiResult } from 'src/app/base.service';
import { HttpClient } from '@angular/common/http';
import { ClienteEndereco } from './cliente-endereco/cliente-endereco';
import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ClienteEnderecoService extends BaseService {
  constructor(http:HttpClient)
  {
        super(http);
  }

  clienteEndereco:ClienteEndereco[];
  private urlWebApi:string='https://localhost:5001/api/clientesEndereco/';
  private url:string;

  getData<ApiResult>(pageIndex: number, pageSize: number, sortColumn: string, sortOrder: string, filterColumn: string, filterQuery: string): Observable<ApiResult> {
    throw new Error('Method not implemented.');
  }
  get<T>(codigoCliente: number): Observable<T> {
    this.url =this.urlWebApi + codigoCliente;
        
    return this.http.get<T>(this.url);

  }

  put<T>(item: T): Observable<T> {
    throw new Error('Method not implemented.');
  }
  post<T>(item: T): Observable<T> {
    throw new Error('Method not implemented.');
  }
  delete<T>(id: number): Observable<T> {
    throw new Error('Method not implemented.');
  }

  

  

}
