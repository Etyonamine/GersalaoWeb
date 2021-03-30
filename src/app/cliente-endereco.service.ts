import { ApiResult } from 'src/app/base.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ClienteEndereco } from './cliente-endereco/cliente-endereco';
import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ClienteEnderecoService extends BaseService {
  delete<T>(id: number): Observable<T> {
    throw new Error('Method not implemented.');
  }
  constructor(http:HttpClient)
  {
        super(http);
  }

  clienteEndereco:ClienteEndereco[];
  //private urlWebApi:string='https://localhost:5001/api/clientesEndereco/';
  private urlWebApi:string='https://localhost:44368/api/clientesEndereco/';
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
  post<ClienteEndereco>(item): Observable<ClienteEndereco> {
    this.url =this.urlWebApi;
    return this.http.post<ClienteEndereco>(this.url,item);

  }

  Apagar<T>(codigoCliente: number, codigoEndereco:number): Observable<T> {
    var params = new HttpParams()
                 .set("codigoCliente",codigoCliente.toString())
                 .set("codigoEndereco",codigoEndereco.toString());

    this.url=this.urlWebApi;   
    return this.http.delete<T>(this.url,{params});

  }

  

  

}
