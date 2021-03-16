
import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http';
import { BaseService,ApiResult } from '../base.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn:'root',
})


export class ClienteService extends BaseService{
   
    constructor(
        http: HttpClient
        ) 
        {        
            super(http);
        }
     

    private urlWebApi:string='https://localhost:44314/api/clientes/';
    private url:string;

    getData<ApiResult>(pageIndex: number,
        pageSize: number,
        sortColumn: string,
        sortOrder: string,
        filterColumn: string,
        filterQuery: string): Observable<ApiResult> {

        
        this.url=this.urlWebApi;

        var params = new HttpParams()
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


    get<Cliente>(codigo: number): Observable<Cliente> {
        this.url =this.urlWebApi + codigo;
        
        return this.http.get<Cliente>(this.url);
    }

    put<Cliente>(item): Observable<Cliente> {
        this.url =this.urlWebApi + item.codigo;

        return this.http.put<Cliente>(this.url, item);
    }

    post<Cliente>(item): Observable<Cliente> {
        
        this.url = this.urlWebApi;
        return this.http.post<Cliente>(this.url, item);
    }

    delete<Cliente>(codigo:number):Observable<Cliente>{
        this.url=this.urlWebApi + codigo;
        return this.http.delete<Cliente>(this.url);
    }
}
