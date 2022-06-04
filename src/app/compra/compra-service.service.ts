import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { BaseService } from '../shared/base.service';
import { Compra } from './compra';

@Injectable({
  providedIn: 'root'
})
export class CompraServiceService extends BaseService<Compra>{
  url = `${environment.API}compras`;

  constructor(protected http:HttpClient) {
    super(http,`${environment.API}compras` )
   }

   baixaPagto(obj : Compra){
     let urlBaixa = this.url + '/baixaPagtoBoleto';    
    return this.http.put<Compra>(urlBaixa,obj).pipe(take(1));
    // return this.http.put<T>(`${ this.API_URL + '/'+ record['codigo'] }`, record).pipe(take(1));
   }
}
