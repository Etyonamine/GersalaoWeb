import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { BaseService } from '../shared/base.service';
import { ProdutoLinha } from './produto-linha';

@Injectable({
  providedIn: 'root'
})
export class ProdutoLinhaService extends BaseService<ProdutoLinha>{

  constructor(http: HttpClient) 
  {
    super(http, `${environment.API}ProdutoLinhas`)
   }
}
