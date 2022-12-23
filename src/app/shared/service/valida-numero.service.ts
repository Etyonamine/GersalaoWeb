import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidaNumeroService {

  constructor() { }

  somenteNumero(valor:string){
    var reg = /^\d+$/;
    return reg.test(valor);
  }
  somenteNumeroEVirgulaEPonto(valor:string){
    var reg = /^[\d,.?!]+$/;
    return reg.test(valor);
  }
  quantidadeCaracteresValido(qtde:number, valor:string){    
    var valorValidar = valor.trim();

    if (qtde < valorValidar.length){
      return false;

    }
    else if( qtde >valorValidar.length){

      return false;      
    }
    return true;
  }
}
