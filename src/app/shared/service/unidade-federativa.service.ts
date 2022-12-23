import { UnidadeFederativa } from './../UnidadeFederativa/unidadeFederativa';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './../base.service';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UnidadeFederativaService extends BaseService<UnidadeFederativa>{

  constructor(protected http:HttpClient) {
    super(http, `${environment.API}unidadeFederativas`);
  }
  
}
