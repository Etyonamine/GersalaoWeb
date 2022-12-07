import { SituacaoService } from './../situacao/situacao.service';
import { TipoServicoService } from './../tipo-servico/tipo-servico.service';

import { AlertService } from './../shared/alert/alert.service';
import { ServicosService } from './servicos.service';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Servico } from './servico';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { EMPTY, Subscription } from 'rxjs';
import { ApiResult } from '../shared/base.service';
import { TipoServico } from '../tipo-servico/tipo-servico';

@Component({
  selector: 'app-servico',
  templateUrl: './servico.component.html',
  styleUrls: ['./servico.component.scss']
})
export class ServicoComponent implements OnInit, OnDestroy{

  servicos : MatTableDataSource<Servico>;

  public colunas: string[]=["codigo","descricao", "valor", "tipoServico.descricao", "datacadastro","dataalteracao","acao"];

  defaultPageIndex :number = 0 ;
  defaultPageSize:number = 10;
  defaultSortColumn:string = "descricao";
  defaultSortOrder:string = "asc";
  defaultFilterColumn: string= "descricao";
  filterQuery:string=null;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort:MatSort;

  inscricao: Subscription;
  tipoServico : TipoServico;
 constructor(private servicosService: ServicosService,
              private alertService: AlertService,
              private tipoServicoService: TipoServicoService,
              private situacaoService : SituacaoService
              ) { }

  ngOnInit(): void {
    this.tipoServico = <TipoServico>{};
    this.listarServicos();

  }
  listarServicos(query:string = null){
    var pageEvent = new PageEvent();
    pageEvent.pageIndex= this.defaultPageIndex;
    pageEvent.pageSize=this.defaultPageSize;

    if (query){
      this.filterQuery=query;
    }
    this.getData(pageEvent);

  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if(this.inscricao){
      this.inscricao.unsubscribe();
    }
  }

  handleError(msg: string)
  {
    this.alertService.mensagemErro(msg);
  }

  handlerSuccess(msg: string) {
    this.alertService.mensagemSucesso(msg);
  }

  getData(event:PageEvent)
  {
    var sortColumn = (this.sort)?this.sort.active:this.defaultSortColumn;
    var sortOrder = (this.sort)?this.sort.direction:this.defaultSortOrder;
    var filterColumn =(this.filterQuery)?this.defaultFilterColumn:null;
    var filterQuery=(this.filterQuery)?this.filterQuery:null;

    this.inscricao =  this.servicosService.getData<ApiResult<any>>(
                      event.pageIndex,
                      event.pageSize,
                      sortColumn,
                      sortOrder,
                      filterColumn,
                      filterQuery
                    )
                    .subscribe(result=>{
                      this.servicos = new MatTableDataSource<Servico>(result.data);

                      if(result.data.length>0){
                        for(let i = 0 ; i<result.data.length;i++){

                          var codigoTipo = result.data[i].codigoTipoServico;
                          this.tipoServicoService.get<TipoServico>(codigoTipo)
                          .subscribe(tipoencontrado=>{

                            result.data[i].tipoServico = tipoencontrado;


                          });

                        }

                        this.servicos = new MatTableDataSource<Servico>(result.data);

                      }
                      this.paginator.length=result.totalCount;
                      this.paginator.pageIndex=result.pageIndex;
                      this.paginator.pageSize=result.pageSize;

                    }, error=>
                    {
                      console.error(error);
                      if (error.status!== 404){
                        this.handleError('Erro ao carregar a lista de serviços. Tente novamente mais tarde.');
                        
                        
                        
                      }else{
                        return EMPTY;
                      }
                      
                    });

  }

  excluirRegistro(codigo : number){
    var msgSucess: string = 'Registro excluído com sucesso!';
    var msgErro: string = 'Ocorreu um erro na tentativa de exclusão  do cliente.'

    this.servicosService.delete(codigo).subscribe(sucesso => {
      this.handlerSuccess(msgSucess);
      setTimeout(() => { this.listarServicos(); }, 3000);
    }, error => {
      console.log(error);
      this.handleError(msgErro);
    });
  }
  openConfirmExclusao(codigo : number, nome:string) {
    var mensagem = `Tem certeza que deseja excluir o serviço: [ ${nome} ]?`;

    this.alertService.openConfirmModal(mensagem, 'Excluir - Cliente', (answer: boolean) => {
      if (answer) {

        this.excluirRegistro(codigo);
      }
    }, "Sim", "Não"
    );
  }



}
