import { HttpClient } from '@angular/common/http';
import { BaseService } from 'src/app/shared/base.service';
import { Injectable } from '@angular/core';
import { ProfissionalServico } from './profissional-servico';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ProfissionalServicoService extends BaseService<ProfissionalServico>{

  constructor(protected http : HttpClient ) {
    super(http,`${environment.API}profissionalServico` );
  }
}
