import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { BaseService } from '../shared/base.service';
import { ProfissionalApuracao } from './profissional-apuracao';
import { ProfissionalApuracaoExcluirIn } from './profissional-apuracao-detalhe/profissional-apuracao-excluir-in';
import { ProfissionalApuracaoIn } from './profissional-apuracao-in';

@Injectable({
  providedIn: 'root'
})
export class ProfissionalApuracaoService extends BaseService<ProfissionalApuracao>{
  url : string = `${environment.API}profissionalApuracao`;
  constructor(protected http: HttpClient,) {
    super(http, `${environment.API}profissionalApuracao`);
  }
  salvar(profissionalApuracaoIn : ProfissionalApuracaoIn){
    return this.http.post<number>(this.url,profissionalApuracaoIn).pipe(take(1));
  }
  apagar(profissionalApuracaoExcluirIn: ProfissionalApuracaoExcluirIn){
    let urlApagar = this.url + '/' + profissionalApuracaoExcluirIn.codigoApuracao + '/' + profissionalApuracaoExcluirIn.codigoUsuarioAlteracao;
    
    return this.http.delete(urlApagar).pipe(take(1));
  }
  descricaoSituacao(codigoApuracao: number){
    let urlSituacao = this.url + '/situacao/' + codigoApuracao;
    return this.http.get<string>(urlSituacao).pipe(take(1));
  }
}
