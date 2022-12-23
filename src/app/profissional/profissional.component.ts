import { EMPTY, Subscription } from 'rxjs';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { ProfissionalService } from './profissional.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Component, OnDestroy, OnInit,  ViewChild } from '@angular/core';
import { Profissional } from './professional';
import { ApiResult } from '../shared/base.service';
import { TipoServicoResolveGuard } from '../tipo-servico/guard/tipo-servico-resolver.guard';
import { TipoServicoService } from '../tipo-servico/tipo-servico.service';


@Component({
  selector: 'app-profissional',
  templateUrl: './profissional.component.html',
  styleUrls: ['./profissional.component.scss']
})
export class ProfissionalComponent implements OnInit, OnDestroy {

  profissionais : MatTableDataSource<Profissional>;
  lista : Array<Profissional> ;

  inscricao$  : Subscription;


  public colunas: string[]=["codigo","nome", "tiposervico", "situacao","datacadastro","dataalteracao", "acao"];

  defaultPageIndex :number = 0 ;
  defaultPageSize:number = 10;

  public defaultSortColumn:string = "nome";
  public defaultSortOrder:string = "asc";

  defaultFilterColumn: string= "nome";
  filterQuery:string=null;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort:MatSort;

  constructor(private service: ProfissionalService,
              private tipoServicoService : TipoServicoService,
              private serviceAlert : AlertService) { }

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(){
    if (this.inscricao$){
      this.inscricao$.unsubscribe();
    }
  }

  loadData(query:string = null)
  {
    var pageEvent = new PageEvent();
    pageEvent.pageIndex= this.defaultPageIndex;
    pageEvent.pageSize=this.defaultPageSize;
    this.filterQuery = null;

    if (query!== null && query.toString().trim()!==''){
      this.filterQuery=query;
    }

    this.getData(pageEvent);

  }
  
  getData(event:PageEvent)
  {
    var sortColumn = (this.sort)?this.sort.active:this.defaultSortColumn;
    var sortOrder = (this.sort)?this.sort.direction:this.defaultSortOrder;
    var filterColumn =(this.filterQuery)?this.defaultFilterColumn:null;
    var filterQuery=(this.filterQuery)?this.filterQuery:null;

    this.inscricao$ =  this.service.getData<ApiResult<any>>(
                      event.pageIndex,
                      event.pageSize,
                      sortColumn,
                      sortOrder,
                      filterColumn,
                      filterQuery
                    ).subscribe(result=>{
                      this.profissionais = new MatTableDataSource<Profissional>(result.data);
                      this.lista = result.data;
                      this.paginator.length=result.totalCount;
                      this.paginator.pageIndex=result.pageIndex;
                      this.paginator.pageSize=result.pageSize;
                      if (this.profissionais == null){
                        this.handleError()
                        {
                          return EMPTY;
                        };
                      }
                    }, error=>
                    {
                      console.error(error);
                      this.handleError()
                      {
                        return EMPTY;
                      };
                    });
  }

  handleError()
  {
    this.serviceAlert.mensagemErro('Erro ao carregar a lista de clientes. Tente novamente mais tarde.');
  }

}
