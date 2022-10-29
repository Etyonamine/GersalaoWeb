import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { BaseService } from '../shared/base.service';
import { ResetSenha } from './reset-senha';

@Injectable({
  providedIn: 'root'
})
export class ResetSenhaService extends BaseService<ResetSenha>{

  url = `${environment.API}passwordchangerequests` ;

  constructor(protected http : HttpClient) {
    super(http, `${environment.API}passwordchangerequests` );    
   }

  solicitarReset(email:string){
   let urlSolic = this.url + "/EnviarLink?email=" + btoa(email);
   return this.http.post<boolean>(urlSolic,null).pipe(take(1));
  } 
  recuperarResetSenha (idGuid : string){
    let urlGet = this.url + "?idGuid=" + idGuid;
    return this.http.get<ResetSenha>(urlGet).pipe(take(1));
  }
  atualizarSituacaoParaExecutado(idGuid:string){
    let urlPut  = this.url + "/AtualizarStatusReset?idGuid=" + idGuid;
    return this.http.put<boolean>(urlPut,null).pipe(take(1));
  }
}
