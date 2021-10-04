import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';
import { BaseService } from 'src/app/shared/base.service';
import { environment } from 'src/environments/environment';
import { ProfissionalContato } from './profissional-contato';

@Injectable({
  providedIn: 'root'
})
export class ProfissionalContatoService  extends BaseService<ProfissionalContato> {

  constructor(protected http : HttpClient) {
    super(http, `${environment.API}profissionalContato` );
  } 
  urlApi = `${environment.API}profissionalContato`; 

  ExcluirLista(lista:ProfissionalContato[]){
    lista.forEach (registro=>{
      this.http.delete(`${ this.urlApi  + '/' + registro.codigoProfissional + '/' + registro.codigoContato }`).pipe(take(1));
    });
    
    return true;

  }
}
