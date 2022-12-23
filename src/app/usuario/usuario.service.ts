import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Login } from '../login/login';
import { ResetSenhaAlterar } from '../reset-senha/reset-senha-alterar';
import { BaseService } from '../shared/base.service';
import { Usuario } from './usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService extends BaseService<Usuario> {
  url = `${environment.API}Usuarios`;

  constructor(protected http : HttpClient) {
    super(http,`${environment.API}Usuarios`);
   }

  verificarSenhaForte(senha:string)
  {
    let r = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#])(?:([0-9a-zA-Z$*&@#])(?!\1)){8,}$/;
    return r.test(senha);
  }
  alterarSenha(codigo:string, senha:string){
    let urlAlterar = this.url + '/AlterarSenha';

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let codigoCriptografada = btoa(codigo);
    let senhaCriptografada = btoa(senha);
    let objLoginCriptografado = {codigo : codigoCriptografada , senha:senhaCriptografada} as Login;

    return this.http.put<boolean>(urlAlterar,objLoginCriptografado,httpOptions);
  }
  alterarSenhaReset (idGuidParam:string, senhaParam:string){
    let urlPutResetSenha  = this.url + "/AlterarSenhaReset";
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };   
    let idGuidCripto = btoa(idGuidParam);
    let senhaCriptografada = btoa(senhaParam);
    let resetSenhaGravar = {
                            idGuid : idGuidCripto,
                            senha : senhaCriptografada
                           } as ResetSenhaAlterar;
    return this.http.put<boolean>(urlPutResetSenha,resetSenhaGravar,httpOptions);
  }
  listarTodos(){
    let urlTodos = this.url + '/All';
    return this.http.get<Usuario[]>(urlTodos).pipe(take(1));
  }
}
