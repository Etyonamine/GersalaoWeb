import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConsultaCepService {

  constructor( private http:HttpClient) { }

  consultaCEP(cep:string){
    cep = cep.replace(/\D/g,'');

    //verifica se possui cep informado
    if (cep!=''){
      var validacep= /^[0-9]{8}$/;

      //Valida o formato do CEP.
      if(validacep.test(cep))
      {
        return this.http.get(`//viacep.com.br/ws/${cep}/json`);
      }
      return of({});
    }
  }
}
