import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { take } from 'rxjs/operators';
import { BaseService } from 'src/app/shared/base.service';
import { environment } from 'src/environments/environment';
import { ProfissionalEndereco } from './profissional-endereco';

@Injectable({
  providedIn: 'root'
})
export class ProfissionalEnderecoService extends BaseService<ProfissionalEndereco>{

  constructor(protected http : HttpClient) 
  { 
    super(http, `${environment.API}profissionalendereco` );
  }

  excluirTodos(codigoProfissional :number , codigoEndereco : number){
    var url = `${environment.API}profissionalendereco` + '/' + codigoProfissional + '/' + codigoEndereco;
    this.http.delete(url).pipe(take(1)).subscribe();
    return of (true);
  }
}
