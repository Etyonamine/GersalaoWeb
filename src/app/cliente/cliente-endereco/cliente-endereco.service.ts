import { ClienteEndereco } from './../cliente-endereco';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BaseService } from './../../shared/base.service';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { take } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClienteEnderecoService extends BaseService<ClienteEndereco>{

  constructor(protected http:HttpClient) {
    super(http,`${environment.API}clientesendereco`);
  }
  excluirTodos(clienteEnderecos: ClienteEndereco[]){
    clienteEnderecos.forEach(element => {

      var url = `${environment.API}clientesendereco` + '/' + element.codigoCliente + '/' + element.codigoEndereco;
      this.http.delete(url).pipe(take(1)).subscribe();
    });

    return of (true);
  }
}
