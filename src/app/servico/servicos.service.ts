import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './../shared/base.service';
import { Injectable } from '@angular/core';
import { Servico } from './servico';
import { ServicoGravar } from './servicoGravar';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ServicosService extends BaseService<Servico>{

  url = `${environment.API}Servicos`;

  constructor(protected http : HttpClient) {
    super(http,`${environment.API}Servicos`);
  }

  servicoToServicoGravar(servico:Servico){

    return { 
      codigo : servico.codigo.toString(),
      codigoTipoServico : servico.codigoTipoServico.toString(),
      codigoSituacao : servico.codigoSituacao.toString(),
      descricao : servico.descricao,
      valor : servico.valor.toString(),
      dataCadastro : (servico.dataCadastro.toString()),
      codigoUsuarioCadastro : servico.codigoUsuarioCadastro.toString(),
      dataAlteracao : servico.dataAlteracao !== null ?  servico.dataAlteracao.toString() : null,
      codigoUsuarioAlteracao : servico.codigoUsuarioAlteracao ?  servico.codigoUsuarioAlteracao.toString(): null
    }as ServicoGravar;

  }
  servicoGravarCriptografado(servicoGravar: ServicoGravar){

    let servicoGravarCriptografado =  {
      codigo : btoa(servicoGravar.codigo),
      codigoTipoServico : btoa(servicoGravar.codigoTipoServico),
      codigoSituacao : btoa(servicoGravar.codigoSituacao),
      descricao : btoa(servicoGravar.descricao),
      valor : btoa(servicoGravar.valor),
      dataCadastro : btoa(servicoGravar.dataCadastro),
      codigoUsuarioCadastro : btoa(servicoGravar.codigoUsuarioCadastro),
      dataAlteracao : servicoGravar.dataAlteracao !== null ? btoa(servicoGravar.dataAlteracao) : null,
      codigoUsuarioAlteracao :  servicoGravar.codigoUsuarioAlteracao !== null ? btoa(servicoGravar.codigoUsuarioAlteracao):null
    } as ServicoGravar;

    return servicoGravarCriptografado;
  }
  salvarRegistroComCripto(servicoGravar:ServicoGravar)
  {
    let servicoGravarPost = this.servicoGravarCriptografado(servicoGravar);
    return this.http.post<ServicoGravar>(this.url, servicoGravar).pipe(take(1));
  }
  atualizarRegistro(servicoGravar: ServicoGravar){
    let servicoGravarPut = this.servicoGravarCriptografado(servicoGravar);
    return this.http.put<ServicoGravar>(this.url, servicoGravarPut).pipe(take(1));
  }
  listarServicoPorTipo (codigoTipo: string)
  {
    let codigoTipoCripto: string = btoa(codigoTipo) ;

    let urlListaServico = this.url + '/ListaServicoPorTipo?codigoTipo=' + codigoTipoCripto;
    return this.http.post<ServicoGravar[]>(urlListaServico,null).pipe(take(1));
  }
}
