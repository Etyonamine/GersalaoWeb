import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServicoReportService {
  url : string = `${environment.ApiReport}Servicos`;
  constructor(protected http: HttpClient,) {
    
  }
  gerarLista(usuarioImpressao : string){
    let urlListaCliente = this.url + '?usuarioImpressao=' + btoa(usuarioImpressao);
    return this.http.get(urlListaCliente,{responseType: 'arraybuffer'}).pipe(take(1));
  }   
}
