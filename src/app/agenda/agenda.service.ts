import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { BaseService } from '../shared/base.service';
import { Agenda } from './agenda';

@Injectable({
  providedIn: 'root'
})
export class AgendaService extends BaseService<Agenda>{

  constructor(protected http : HttpClient) { super(http, `${environment.API}agendas` );}

  url : string = `${environment.API}agendas`;


}
