import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { BaseService } from '../shared/base.service';
import { MotivoCancelamentoServico } from './motivo-cancelamento-servico';

@Injectable({
  providedIn: 'root'
})
export class MotivoCancelamentoServicoService extends BaseService<MotivoCancelamentoServico>{
  url : string = `${environment.API}motivocancelamentoservicos`;

  constructor(protected http : HttpClient) {
    super(http,`${environment.API}motivocancelamentoservicos` );
  }
  Listar(){
    return this.http.get<MotivoCancelamentoServico[]>(this.url).pipe(take(1));
  }
}
