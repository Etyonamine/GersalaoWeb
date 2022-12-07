import { environment } from './../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './../shared/base.service';
import { Injectable } from '@angular/core';
import { Documento } from './documento';

@Injectable({
  providedIn: 'root'
})
export class DocumentoService  extends BaseService<Documento> {

  constructor(protected http:HttpClient) {
    super(http, `${ environment.API}documentos`);
  }
}
