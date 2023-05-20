import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AgendaReportService {

  url : string = `${environment.ApiReport}Agendas`;
  constructor(protected http: HttpClient) { }
  
  gerarLista(usuarioImpressao : string, inicio: string, fim: string, codigoSituacao: number){        
    let urlLista = this.url + '?usuarioImpressao=' + btoa(usuarioImpressao) + '&dataInicio=' + new Date(inicio).toLocaleDateString() + '&DataFim=' + new Date(fim).toLocaleDateString();
    
    if (codigoSituacao !== undefined && codigoSituacao > 0 ){
      urlLista += '&codigoSituacao=' + codigoSituacao
    }

    return this.http.get(urlLista,{responseType: 'arraybuffer'}).pipe(take(1));
  }   
}
