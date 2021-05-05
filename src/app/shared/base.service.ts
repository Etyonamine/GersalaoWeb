import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

// @Injectable({
//   providedIn: 'root'
// })
export class BaseService<T> {

  constructor(
              protected http: HttpClient,
              private API_URL: string) { }

  getData<ApiResult>(pageIndex: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string,
    filterColumn: string,
    filterQuery: string): Observable<ApiResult> {


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
    return this.http.get<ApiResult>(this.API_URL, { params }).pipe(take(1));
  }

  list<T>(): Observable<T>{
    return this.http.get<T>(this.API_URL).pipe(take(1));
  }

  get<T>(codigo): Observable<T> {
    return this.http.get<T>(this.API_URL + "/" + codigo).pipe(take(1));
  }

  private create(record: T)
  {
    return this.http.post<T>(this.API_URL, record).pipe(take(1));
  }

  private update(record: T)
  {
    return this.http.put<T>(`${ this.API_URL + '/'+ record['codigo'] }`, record).pipe(take(1));
  }

  // put<T>(recurso:T): Observable<T> {
  //   return this.http.put<T>(`${ this.API_URL + '/'+ recurso['codigo'] }`, recurso).pipe(take(1));
  // }

  // post<T>(recurso:T): Observable<T> {
  //   return this.http.post<T>(this.API_URL, recurso).pipe(take(1));
  // }

  // private delete<T>(codigo): Observable<T> {
  //   return this.http.delete<T>(`${ this.API_URL + '/' + codigo}`).pipe(take(1));
  // }
  save(recurso: T){
    if(recurso['codigo']){
      return this.update(recurso);
    }
    else{
      return this.create(recurso);
    }
  }

  delete (codigo){
    return this.http.delete(`${ this.API_URL + '/' + codigo}`).pipe(take(1));
  }

  isDupe( item :T): Observable<boolean> {
    const headers = new HttpHeaders();
    headers.set("Content-Type", "application/json; charset=utf-8");

    var url = this.API_URL + '/IsDupe';
    return this.http.post<boolean>(url,item,{headers});
  }
}


export interface ApiResult<T> {
  data: T[];
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  sortColumn: string;
  sortOrder: string;
  filterColumn: string;
  filterQuery: string;
}


