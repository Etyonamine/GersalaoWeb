import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BaseService } from '../shared/base.service';
import { Empresa } from './empresa';
import { take } from 'rxjs/operators';
import { EmpresaEndereco } from './empresa-endereco';
import { Endereco } from '../endereco/endereco';
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
  AtualizarInformacao(empresa:Empresa){

    let empresacripto = this.criptografarBase64(empresa);
   return this.http.put(this.url,empresacripto).pipe(take(1));
  }
  criptografarBase64(empresa:Empresa){
    

    empresa.codigo = btoa(empresa.codigo), 
    empresa.horaFim = btoa(empresa.horaFim),
    empresa.horaInicial = btoa(empresa.horaInicial),
    empresa.nome = btoa(empresa.nome),
    empresa.nomeAbreviado = btoa(empresa.nomeAbreviado), 
    empresa.quantidadeMinutosServico = btoa(empresa.quantidadeMinutosServico)
    if (empresa.empresaDocumento.length>0){
      let docParam = empresa.empresaDocumento[0].Documento;
      docParam.descricao = btoa(docParam.descricao);
      empresa.empresaDocumento[0].Documento = docParam;
    }
    if (empresa.empresaEndereco.length>0){
      
      let enderecoParam = empresa.empresaEndereco[0].endereco;    
    
      enderecoParam.descricao = (enderecoParam.descricao !== undefined && enderecoParam.descricao.trim() !== '') ? btoa(enderecoParam.descricao):null;
      enderecoParam.numero = enderecoParam.numero !== undefined || enderecoParam.numero !== '' ? btoa(enderecoParam.numero):null;
      enderecoParam.bairro = (enderecoParam.bairro !== undefined && enderecoParam.bairro.trim() !== '')? btoa(enderecoParam.bairro): null;
      enderecoParam.cep = enderecoParam.cep !== undefined ? enderecoParam.cep: null;
      enderecoParam.complemento  =(enderecoParam.complemento !== '' && enderecoParam.complemento !== undefined) ? btoa(enderecoParam.complemento):null;        
      
      empresa.empresaEndereco[0].endereco = enderecoParam;      
    }    
    return empresa;
    
  }
}
