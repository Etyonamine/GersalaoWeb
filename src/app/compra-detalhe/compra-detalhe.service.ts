import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { BaseService } from '../shared/base.service';
import { CompraDetalhe } from './compra-detalhe';

@Injectable({
  providedIn: 'root'
})
export class CompraDetalheService extends BaseService<CompraDetalhe> {

  constructor(protected http:HttpClient) { 
    super(http,`${environment.API}comprasdetalhes`);
  }
}
