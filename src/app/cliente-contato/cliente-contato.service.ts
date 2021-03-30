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
   //urlBase : string = "https://localhost:5001/api/clientesContato/";
   private urlBase:string='https://localhost:44368/api/clientesContato/';
   url:string;

  getData<ApiResult>(pageIndex: number, pageSize: number, sortColumn: string, sortOrder: string, filterColumn: string, filterQuery: string): Observable<ApiResult> {
    throw new Error('Method not implemented.');
  }
  get<T>(id: number): Observable<T> {
    this.url = this.urlBase + id.toString();
    return this.http.get<T>(this.url);

  }

  put<T>(item: T): Observable<T> {
    throw new Error('Method not implemented.');
  }
  post<ClienteContato>(item): Observable<ClienteContato> {
    var url=this.urlBase;
    return this.http.post<ClienteContato>(url,item);
  }
 
  apagar<T>(id: number, codigoContato:number): Observable<T> {
    this.url = this.urlBase ;
    var params = new HttpParams()
                      .set("codigoCliente",id.toString())
                      .set("codigoContato",codigoContato.toString());

    return this.http.delete<T>(this.url,{params});
  }
  
  delete<T>(id: number): Observable<T> {
    throw new Error('Method not implemented.');
  }

}