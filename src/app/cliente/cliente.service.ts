import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Cliente } from './cliente';
import { BaseService } from './../shared/base.service';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClienteService extends BaseService<Cliente>{

  constructor(protected http: HttpClient) {
    super(http,`${environment.API}clientes`);
  }

  isDupeCliente(item): Observable<boolean> {
    const headers = new HttpHeaders();
    headers.set("Content-Type", "application/json; charset=utf-8");

    var url = `${environment.API}Clientes/IsDupeCliente`;
    return this.http.post<boolean>(url,item,{headers});
  }
}
