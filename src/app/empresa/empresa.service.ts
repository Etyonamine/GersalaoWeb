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
    empresa.codigo = window.btoa(empresa.codigo) ;
    empresa.horaInicial =  window.btoa(empresa.horaInicial);
    empresa.horaFim =  window.btoa(empresa.horaFim);
    empresa.nome =  window.btoa(empresa.nome);
    empresa.nomeAbreviado =  window.btoa(empresa.nomeAbreviado);  
    empresa.quantidadeMinutosAgenda = window.btoa(empresa.quantidadeMinutosAgenda)  ;
    empresa.empresaEndereco.endereco.descricao = window.btoa(empresa.empresaEndereco.endereco.descricao);
    empresa.empresaEndereco.endereco.bairro = window.btoa(empresa.empresaEndereco.endereco.bairro);
    if (empresa.empresaEndereco.endereco.complemento !== null )
    {
      empresa.empresaEndereco.endereco.complemento = window.btoa(empresa.empresaEndereco.endereco.complemento);    
    }    
    empresa.empresaEndereco.endereco.numero = window.btoa(empresa.empresaEndereco.endereco.numero);
    
    return this.http.put<Empresa>(this.url,empresa).pipe(take(1));
  }
}
