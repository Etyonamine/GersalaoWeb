import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from 'src/app/shared/base.service';
import { environment } from 'src/environments/environment';
import { ProfissionalEndereco } from './profissional-endereco';

@Injectable({
  providedIn: 'root'
})
export class ProfissionalEnderecoService extends BaseService<ProfissionalEndereco>{

  constructor(protected http : HttpClient) 
  { 
    super(http, `${environment.API}profissionalEndereco` );
  }
}
