import { EnderecoComponent } from './endereco.component';
import { Endereco } from './endereco';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../base.service';

@Injectable({
  providedIn: 'root'
})
export class EnderecoServiceService extends BaseService
{

  constructor(http:HttpClient) {
    super(http);
   }

   private urlWebApi:string='https://localhost:5001/api/Enderecos/';
   private url:string;

  getData<ApiResult>(pageIndex: number, pageSize: number, sortColumn: string, sortOrder: string, filterColumn: string, filterQuery: string): Observable<ApiResult> {
    throw new Error('Method not implemented.');
  }
  get<Endereco>(codigo:number): Observable<Endereco> {
    this.url =this.urlWebApi + codigo;
        
    return this.http.get<Endereco>(this.url);
  }
  put<Endereco>(item): Observable<Endereco> {
    this.url = this.urlWebApi + item.codigo;
    return this.http.put<Endereco>(this.url,item);
  }
  post<Endereco>(item): Observable<Endereco> {
    this.url = this.urlWebApi;
    return this.http.post<Endereco>(this.url, item);
  }
  delete<Endereco>(id: number): Observable<Endereco> {
    this.url = this.urlWebApi;
    var params = new HttpParams().set("codigo",id.toString());
    return this.http.delete<Endereco>(this.url,{params});
  }

  
}
