import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../base.service';

@Injectable({
  providedIn: 'root'
})
export class ContatoService extends BaseService
{  
  constructor(http:HttpClient) {
    super(http);
   }
   urlBase : string = "https://localhost:5001/api/Contatos/";
   url:string; 

  getData<ApiResult>(pageIndex: number, pageSize: number, sortColumn: string, sortOrder: string, filterColumn: string, filterQuery: string): Observable<ApiResult> {
    throw new Error('Method not implemented.');
  }
  get<T>(id: number): Observable<T> {
    var url = this.urlBase + id.toString();   
    return this.http.get<T>(url);
  }
  

  put<Contato>(item): Observable<Contato> {
    this.url = this.urlBase + item.codigo;
    return this.http.put<Contato>(this.url,item);
  }
  post<Contato>(item): Observable<Contato> {
    var url = this.urlBase;   
    return this.http.post<Contato>(url,item);
  }
  
  delete<T>(id: number): Observable<T> {
    throw new Error('Method not implemented.');
  }

 

}
