import { HttpClient, HttpParams } from '@angular/common/http';
import { BaseService } from './../base.service';
import { Injectable } from '@angular/core';
import { Municipio } from '../municipios/municipio';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MunicipioService extends BaseService<Municipio>{

  url:string;

  constructor(protected http:HttpClient) {
    super(http, `${environment.API}municipios`);
  }

  getMunicipioPorUF<ApiResult>(codigoUF:number,
                              pageIndex: number,
                              pageSize: number,
                              sortColumn: string,
                              sortOrder: string,
                              filterColumn: string,
                              filterQuery: string): Observable<ApiResult> {

    this.url= `${environment.API}municipios`;

    var params = new HttpParams()
        .set("codigoUF",codigoUF.toString())
        .set("pageIndex", pageIndex.toString())
        .set("pageSize", pageSize.toString())
        .set("sortColumn", sortColumn)
        .set("sortOrder", sortOrder);

    if (filterQuery) {
    params = params
        .set("filterColumn", filterColumn)
        .set("filterQuery", filterQuery);
    }
    return this.http.get<ApiResult>(this.url, { params });

}
}
