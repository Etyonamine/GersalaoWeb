import { HttpClient, HttpParams } from '@angular/common/http';
import { BaseService } from './../../shared/base.service';
import { Injectable } from '@angular/core';
import { ClienteDocumento } from './cliente-documento';
import { environment } from 'src/environments/environment';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClienteDocumentoService extends BaseService<ClienteDocumento> {
  url : string
  constructor(protected http:HttpClient) {
    super(http, `${environment.API}clientesDocumento`);
  }

  excluir(clienteDocumento:ClienteDocumento){
     var params = new HttpParams();
     params.append("codigoCliente", clienteDocumento.codigoCliente.toString());
     params.append("codigoDocumento", clienteDocumento.codigoDocumento.toString());
    //  this.url = `${environment.API}clientesdocumento`;
     this.url = `${environment.API}clientesdocumento` + '/' + clienteDocumento.codigoCliente.toString() + '/' +  clienteDocumento.codigoDocumento.toString();
  // return   this.http.delete(this.url, { params }).pipe(take(1));
    return   this.http.delete(this.url).pipe(take(1));
  }
}

