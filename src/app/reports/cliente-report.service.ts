import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClienteReportService{
  

  url : string = `${environment.ApiReport}Clientes`;
  constructor(protected http: HttpClient,) {
    
  }
  gerarListaClientes(usuarioImpressao : string){
    let urlListaCliente = this.url + '?usuarioImpressao=' + btoa(usuarioImpressao);
    return this.http.get(urlListaCliente,{responseType: 'arraybuffer'}).pipe(take(1));
  }
}
