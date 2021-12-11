import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { BaseService } from '../shared/base.service';
import { Compra } from './compra';

@Injectable({
  providedIn: 'root'
})
export class CompraServiceService extends BaseService<Compra>{

  constructor(protected http:HttpClient) {
    super(http,`${environment.API}compras` )
   }
}
