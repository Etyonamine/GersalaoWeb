import { ClienteContato } from './cliente-contato';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../base.service';

@Injectable({
  providedIn: 'root'
})
export class ClienteContatoService extends BaseService{
  
  constructor(http:HttpClient) 
  {
    super(http);
   }
   urlBase : string = "https://localhost:5001/api/clientesContato/";

  getData<ApiResult>(pageIndex: number, pageSize: number, sortColumn: string, sortOrder: string, filterColumn: string, filterQuery: string): Observable<ApiResult> {
    throw new Error('Method not implemented.');
  }
  get<T>(id: number): Observable<T> {
    var url = this.urlBase + id.toString();
    //var params = new HttpParams()
    //                  .set("codigoCliente",id.toString());

    return this.http.get<T>(url);

  }

  put<T>(item: T): Observable<T> {
    throw new Error('Method not implemented.');
  }
  post<ClienteContato>(item): Observable<ClienteContato> {
    var url=this.urlBase;
    return this.http.post<ClienteContato>(url,item);
  }
  delete<T>(id: number): Observable<T> {
    throw new Error('Method not implemented.');
  }


}