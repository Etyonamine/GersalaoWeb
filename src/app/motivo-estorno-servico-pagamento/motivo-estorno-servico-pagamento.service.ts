import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BaseService } from '../shared/base.service';
import { MotivoEstornoServicoPagamento } from './motivo-estorno-servico-pagamento';

@Injectable({
  providedIn: 'root'
})
export class MotivoEstornoServicoPagamentoService extends BaseService<MotivoEstornoServicoPagamento>{

  constructor(protected http: HttpClient) {
    super(http,`${environment.API}motivoestornoservicopagamento`);
  }
}
