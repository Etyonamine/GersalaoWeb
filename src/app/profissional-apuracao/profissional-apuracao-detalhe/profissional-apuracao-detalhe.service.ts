import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from 'src/app/shared/base.service';
import { environment } from 'src/environments/environment';
import { ProfissionalApuracaoDetalhe } from './profissional-apuracao-detalhe';

@Injectable({
  providedIn: 'root'
})
export class ProfissionalApuracaoDetalheService extends BaseService<ProfissionalApuracaoDetalhe> {
  url: string = `${environment.API}ProfissionalApuracaoDetalhe`;

  constructor(protected http:HttpClient) {
    super(http,`${environment.API}ProfissionalApuracaoDetalhe`);
  }
}
