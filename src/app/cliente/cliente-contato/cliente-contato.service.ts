import { HttpClient, HttpParams } from '@angular/common/http';
import { BaseService } from './../../shared/base.service';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ClienteContato } from './cliente-contato';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClienteContatoService extends BaseService<ClienteContato>{

  constructor(protected http:HttpClient ) {
    super(http,`${environment.API}clientescontato`);
  }
  excluirTodos(clienteContato: ClienteContato[]){
    clienteContato.forEach(element => {
      var url = `${environment.API}clientescontato` + '/' + element.codigoCliente + '/' + element.codigoContato;
      this.http.delete(url).pipe(take(1));
    });
  }
  excluir(codigoCliente:number , codigoContato){
    // var params = new HttpParams();
    // params.append('codigoCliente', codigoCliente.toString());
    // params.append('codigoContato', codigoContato.toString());

    // var url = `${environment.API}clientescontato` ;
    // return this.http.delete(url,{params}).pipe(take(1));
    var url = `${environment.API}clientescontato` + '/' + codigoCliente.toString() + '/' + codigoContato.toString() ;

    return this.http.delete(url).pipe(take(1));
  }
}
