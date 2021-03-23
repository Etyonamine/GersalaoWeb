import { Municipio } from './municipio';
import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BaseService, ApiResult } from '../base.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn:'root',
})

export class MunicipioService extends BaseService{
    
    //private urlWebApi:string='https://localhost:44314/api/municipios/';
    private urlWebApi:string='https://localhost:5001/api/municipios/';
    private url:string;

    getMunicipioPorUF<ApiResult>(codigoUF:number, pageIndex: number, pageSize: number, sortColumn: string, sortOrder: string, filterColumn: string, filterQuery: string): Observable<ApiResult> {

        this.url= this.urlWebApi;

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
    getData<ApiResult>(pageIndex: number, pageSize: number, sortColumn: string, sortOrder: string, filterColumn: string, filterQuery: string): Observable<ApiResult> {
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
    
    get<Municipio>(id: number): Observable<Municipio> {
        this.url=this.urlWebApi + id.toString();
        
        
        return this.http.get<Municipio>(this.url);
    }

    put<T>(item: T): Observable<T> {
        throw new Error('Method not implemented.');
    }
    post<T>(item: T): Observable<T> {
        throw new Error('Method not implemented.');
    }
    delete<T>(id: number): Observable<T> {
        throw new Error('Method not implemented.');
    }
    constructor(http: HttpClient
    ){
        
        super(http);
    }

    
    
}