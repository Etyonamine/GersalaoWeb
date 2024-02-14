import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BaseService } from '../shared/base.service';
import { Empresa } from './empresa';
import { take } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class EmpresaService extends BaseService<Empresa> {

  constructor(protected http: HttpClient) {
    super(http,`${environment.API}empresas`);
  }
  url = `${environment.API}empresas`;

  recuperarDadosEmpresa(){
    return this.http.get<Empresa>(this.url).pipe(take(1));
  }
  atualizar(empresa:Empresa){
    //criptografar dados da empresa
    empresa.codigo = btoa(empresa.codigo);
    empresa.horaInicial =  btoa(empresa.horaInicial);
    empresa.horaFim =  btoa(empresa.horaFim);
    empresa.nome =  btoa(empresa.nome);
    empresa.nomeAbreviado =  btoa(empresa.nomeAbreviado);  
    empresa.quantidadeMinutosAgenda = btoa(empresa.quantidadeMinutosAgenda)  ;
    return this.http.put<Empresa>(this.url,empresa).pipe(take(1));
  }
}
