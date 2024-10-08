import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Cliente } from './cliente';
import { BaseService } from './../shared/base.service';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { ClienteViewModel } from './clienteViewModel';

@Injectable({
  providedIn: 'root'
})
export class ClienteService extends BaseService<Cliente>{
  url : string =`${environment.API}Clientes`;

  constructor(protected http: HttpClient) {
    super(http,`${environment.API}clientes`);
  }

  isDupeCliente(item): Observable<boolean> {
    const headers = new HttpHeaders();
    headers.set("Content-Type", "application/json; charset=utf-8");

    var url = `${environment.API}Clientes/IsDupeCliente`;
    return this.http.post<boolean>(url,item,{headers});
  }

  lista():Observable<Cliente[]>{
    let ulrLista  = this.url +'/Lista';
    return this.http.get<Cliente[]>(ulrLista).pipe(take(1));
  }
  listaClientes(){
    let urllistaclientes = this.url + '/ListaClientes';
    return this.http.get<ClienteViewModel[]>(urllistaclientes).pipe(take(1));
  }
  ConverterListaCriptografadaCliente(lista : ClienteViewModel[]){
    let listaDescriptografada : Array<ClienteViewModel> = [];
    lista.forEach(cliente=>{
      listaDescriptografada.push({codigo : atob(cliente.codigo), nome : atob(cliente.nome)});
    });
    return listaDescriptografada;
  }
  
}
