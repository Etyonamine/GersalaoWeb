import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { EMPTY, Subscription } from 'rxjs';
import { AgendaService } from 'src/app/agenda/agenda.service';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { ApiResult } from 'src/app/shared/base.service';
import { ClienteFinanceiroPendente } from './cliente-financeiro-pendente';

@Component({
  selector: 'app-cliente-financeiro',
  templateUrl: './cliente-financeiro.component.html',
  styleUrls: ['./cliente-financeiro.component.scss']
})
export class ClienteFinanceiroComponent implements OnInit,OnDestroy {
  lista: MatTableDataSource<ClienteFinanceiroPendente>;
  inscricao$: Subscription;

  defaultFilterColumn: string = "NomeCliente";
  filterQuery: string = null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  colunas: string[] = ["codigoCliente", "nomeCliente", "acao"];
  defaultPageIndex: number = 0;
  defaultPageSize: number = 10;
  public defaultSortColumn: string = "nomeCliente";
  public defaultSortOrder: string = "asc";


  constructor(private agendaService:AgendaService,
              private alertService: AlertService) { }

  ngOnInit(): void {
    this.loadData();
  }
  ngOnDestroy(): void{
    if(this.inscricao$){
      this.inscricao$.unsubscribe();
    }
  }
  handlerError(message:string){
    return this.alertService.mensagemErro(message);
  }
  loadData(query: string = null) {
    var pageEvent = new PageEvent();
    pageEvent.pageIndex = this.defaultPageIndex;
    pageEvent.pageSize = this.defaultPageSize;
    this.filterQuery = null;

    if (query !== null && query.toString().trim() !== '') {

      let dataPesq = new Date(query).toLocaleDateString();

      let novaData = dataPesq.substring(6, 10) + '-' + dataPesq.substring(3, 5) + '-' + dataPesq.substring(0, 2);
      this.filterQuery = novaData;
    }

    this.getData(pageEvent);

  }
  getData(event: PageEvent) {
    var sortColumn = (this.sort) ? this.sort.active : this.defaultSortColumn;
    var sortOrder = (this.sort) ? this.sort.direction : this.defaultSortOrder;
    var filterColumn = (this.filterQuery) ? this.defaultFilterColumn : null;
    var filterQuery = (this.filterQuery) ? this.filterQuery : null;

    this.inscricao$ = this.agendaService.getDataClientePendente<ApiResult<any>>(
      event.pageIndex,
      event.pageSize,
      sortColumn,
      sortOrder,
      filterColumn,
      filterQuery
    ).subscribe(result => {

      this.lista = new MatTableDataSource<ClienteFinanceiroPendente>(result.data);
      
      this.paginator.length = result.totalCount;
      this.paginator.pageIndex = result.pageIndex;
      this.paginator.pageSize = result.pageSize;

    }, error => {
      console.error(error);
      if (error.status !== 404) {
        this.handlerError('erro ao recuperar as informações de clientes pendentes.');
      } else {
        return EMPTY;
      }
    });
  }
}
