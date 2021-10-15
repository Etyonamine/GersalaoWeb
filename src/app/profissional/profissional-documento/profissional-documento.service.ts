import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from 'src/app/shared/base.service';
import { environment } from 'src/environments/environment';
import { ProfissionalDocumento } from './profissional-documento';

@Injectable({
  providedIn: 'root'
})
export class ProfissionalDocumentoService extends BaseService<ProfissionalDocumento>{

  constructor(protected http : HttpClient ) { 
    super(http, `${environment.API}profissionalDocumento`);
  }
  
}
