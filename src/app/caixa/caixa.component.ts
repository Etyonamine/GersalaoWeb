import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { EMPTY, Subscription } from 'rxjs';
import { AlertService } from '../shared/alert/alert.service';
import { ApiResult } from '../shared/base.service';
import { Caixa } from './caixa';
import { CaixaService } from './caixa.service';

@Component({
  selector: 'app-caixa',
  templateUrl: './caixa.component.html',
  styleUrls: ['./caixa.component.scss']
})
export class CaixaComponent implements OnInit {

  //*************************estrutura da tabela *************** *//
  lista: MatTableDataSource<Caixa>;
  defaultFilterColumn: string = "dataAbertura";
  filterQuery: string = null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;  
  colunas: string[] = [ "codigo", "dataAbertura", "dataFechamento", "valorInicial", "ValorFim" ,"acao"];
  defaultPageIndex: number = 0;
  defaultPageSize: number = 10;
  public defaultSortColumn: string = "dataAbertura";
  public defaultSortOrder: string = "desc";

  inscricao$: Subscription;  

   
  constructor(private caixaService: CaixaService,
              private alertService: AlertService) { }

  ngOnInit(): void {
    this.loadData();
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

    this.inscricao$ = this.caixaService.getData<ApiResult<any>>(
      event.pageIndex,
      event.pageSize,
      sortColumn,
      sortOrder,
      filterColumn,
      filterQuery
    ).subscribe(result => {
      
      this.lista = new MatTableDataSource<Caixa>(result.data);
      
      this.paginator.length = result.totalCount;
      this.paginator.pageIndex = result.pageIndex;
      this.paginator.pageSize = result.pageSize;
    }, error => {
      console.error(error);
      if (error.status !== 404) {
        this.handleError('erro ao recuperar as informações de caixas.');
      } else {
        return EMPTY;
      }
    });
  }
  handleError(msg:string){
    this.alertService.mensagemErro(msg);
  }
}