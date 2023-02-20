import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { BaseService } from '../shared/base.service';
import { CaixaDetalhe } from './caixa-detalhe';
import { CaixaDetalheIn } from './caixa-detalhe-in';

@Injectable({
  providedIn: 'root'
})
export class CaixaDetalheService extends BaseService<CaixaDetalhe> {
  url : string =`${environment.API}CaixasDetalhes`;
  constructor(protected http: HttpClient) {
    super(http,`${environment.API}CaixasDetalhes`);
  }   
  salvarLancamentoManual(caixaDetalhe:CaixaDetalhe){
    let urlSalvar = this.url + '/criar';
    return this.http.post<CaixaDetalhe>(urlSalvar, caixaDetalhe).pipe(take(1));
  }
  recuperarLista<ApiResult>(
    codigoCaixa: number,
    pageIndex: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string,
    filterColumn: string,
    filterQuery: string
    ): Observable<ApiResult> {


        var params = new HttpParams()
          .set("codigoCaixa", codigoCaixa)
          .set("pageIndex", pageIndex.toString())
          .set("pageSize", pageSize.toString())
          .set("sortColumn", sortColumn)
          .set("sortOrder", sortOrder);

        if (filterQuery) {
          params = params
            .set("filterColumn", filterColumn)
            .set("filterQuery", filterQuery)            
        }
    return this.http.get<ApiResult>(this.url, { params }).pipe(take(1));
  }
  fecharCaixa(caixaDetalheIn:CaixaDetalheIn){
    return this.http.post<boolean>(this.url,caixaDetalheIn ).pipe(take(1));
  }
}
