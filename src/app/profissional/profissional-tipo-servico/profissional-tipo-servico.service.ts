import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from 'src/app/shared/base.service';
import { environment } from 'src/environments/environment.prod';
import { ProfissionalTipoServico } from './profissional-tipo-servico';

@Injectable({
  providedIn: 'root'
})
export class ProfissionalTipoServicoService extends BaseService<ProfissionalTipoServico> {

  constructor(protected http : HttpClient) {
    super(http, `${environment.API}profissional` );
   }
}
