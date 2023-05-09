import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfissionalReportService {

  url : string = `${environment.ApiReport}Profissionais`;
  constructor(protected http: HttpClient,) {
    
  }
  gerarLista(usuarioImpressao : string){
    //https://localhost:44348/api/Profissionais?usuarioImpressao=VE9TSElP
    let urlLista = this.url + '?usuarioImpressao=' + btoa(usuarioImpressao);
    return this.http.get(urlLista,{responseType: 'arraybuffer'}).pipe(take(1));
  }
}
