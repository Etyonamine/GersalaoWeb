import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth-guard/auth.service';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { ApiResult } from 'src/app/shared/base.service';
import { ProfissionalApuracaoService } from '../profissional-apuracao.service';
import { ProfissionalApuracaoDetalhe } from './profissional-apuracao-detalhe';
import { ProfissionalApuracaoDetalheService } from './profissional-apuracao-detalhe.service';
import { ProfissionalApuracaoExcluirIn } from './profissional-apuracao-excluir-in';

@Component({
  selector: 'app-profissional-apuracao-detalhe',
  templateUrl: './profissional-apuracao-detalhe.component.html',
  styleUrls: ['./profissional-apuracao-detalhe.component.scss']
})
export class ProfissionalApuracaoDetalheComponent implements OnInit {

  
   colunas: string[]=["codigo","inicio", "termino","cliente","servico", "valorServico","valorComissaoPercentual","valorComissao", "origemComissao"]; 
  codigoProfissionalApuracao: number;  
  valorTotal : number;
  dataApuracao: Date;
  quantidadeTotal: number;
  nomeUsuarioCadastro: string;
  inicioPeriodo: Date;
  fimPeriodo: Date;
  situacaoBaixa : string;
  nomeProfissional: string;

  inscricaoExcluir$:Subscription;
  dataBaixa: Date;
  descricaoSituacao: string;

  defaultPageIndex :number = 0 ;
  defaultPageSize:number = 10;
  inscricao$:Subscription;  

  public defaultSortColumn:string = "codigoAgenda";
  public defaultSortOrder:string = "asc";

  defaultFilterColumn: string= "codigoProfissionalApuracao";
  filterQuery:string=null;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort:MatSort;

  listaApuracoes:  MatTableDataSource<ProfissionalApuracaoDetalhe> ;
  codigoUsuario: number;

  constructor(private profissionalApuracaoDetalheService : ProfissionalApuracaoDetalheService,
              private serviceAlert: AlertService,
              private authService : AuthService,
              private route: ActivatedRoute,
              private router: Router,
              private profissionalApuracaoService:ProfissionalApuracaoService,
              private alertService: AlertService) { }

  ngOnInit(): void {
    this.codigoProfissionalApuracao =  this.route.snapshot.data.codigoApuracao;
    this.authService.getUserData();
    this.codigoUsuario = Number(this.authService.usuarioLogado.codigo);
    this.loadData();    
  }
  ngOnDestroy():void{
    if (this.inscricao$) {this.inscricao$.unsubscribe();}
    if (this.inscricaoExcluir$){this.inscricaoExcluir$.unsubscribe();}
  }
  loadData(query:string = null)
  {
    var pageEvent = new PageEvent();
    pageEvent.pageIndex= this.defaultPageIndex;
    pageEvent.pageSize=this.defaultPageSize;
    this.filterQuery = null;

    if (query!== null && query.toString().trim()!==''){      
      
      let dataPesq = new Date(query).toLocaleDateString();
      
      let novaData = dataPesq.substring(6,10) + '-' +  dataPesq.substring(3,5) + '-' + dataPesq.substring(0,2);
      this.filterQuery =   novaData;
    }

    this.getData(pageEvent);

  }
  getData(event:PageEvent)
  {
    var sortColumn = (this.sort)?this.sort.active:this.defaultSortColumn;
    var sortOrder = (this.sort)?this.sort.direction:this.defaultSortOrder;
    /* var filterColumn =(this.filterQuery)?this.defaultFilterColumn:null;
    var filterQuery=(this.filterQuery)?this.filterQuery:null; */
    var filterColumn ='codigoProfissionalApuracao';
    var filterQuery= this.codigoProfissionalApuracao.toString();
  
    this.inscricao$ =  this.profissionalApuracaoDetalheService.getData2<ApiResult<any>>(
                      event.pageIndex,
                      event.pageSize,
                      sortColumn,
                      sortOrder,
                      filterColumn,
                      filterQuery,
                      'N'
                    ).subscribe(result=>{

                      this.listaApuracoes = new MatTableDataSource<ProfissionalApuracaoDetalhe>(result.data); 
                      this.preencherDadosApuracao(result.data);
                      this.paginator.length=result.totalCount;
                      this.paginator.pageIndex=result.pageIndex;
                      this.paginator.pageSize=result.pageSize;    
                      this.dataBaixa = this.listaApuracoes.data[0].profissionalApuracao.dataBaixa;  
                      
                    }, error=>
                    {
                      console.error(error);
                      if (error.status!== 404){
                        this.handleError('Erro ao carregar a lista de compras. Tente novamente mais tarde.');
                      }else{
                        return EMPTY;
                      }                      
                    });
  }
  preencherDadosApuracao(profissionalApuracaoDetalhe){
    this.dataApuracao = profissionalApuracaoDetalhe[0].profissionalApuracao.dataApuracao;
    this.valorTotal = profissionalApuracaoDetalhe[0].profissionalApuracao.valorTotal;
    this.quantidadeTotal = profissionalApuracaoDetalhe[0].profissionalApuracao.quantidadeTotal;
    this.nomeUsuarioCadastro = profissionalApuracaoDetalhe[0].profissionalApuracao.usuarioCadastro.nome;
    this.inicioPeriodo = profissionalApuracaoDetalhe[0].profissionalApuracao.dataInicio;
    this.fimPeriodo = profissionalApuracaoDetalhe[0].profissionalApuracao.dataFim;
    this.situacaoBaixa = profissionalApuracaoDetalhe[0].profissionalApuracao.dataBaixa == null? "Pendente": "Pago";
    this.nomeProfissional = profissionalApuracaoDetalhe[0].agendaServico.profissional.nome;
  }
  handleError(mensagem:string)
  {
    this.serviceAlert.mensagemErro(mensagem);
  }
  apagarApuracao() {

    this.serviceAlert.openConfirmModal('Por favor, confirmar se deseja excluir a apuração?',
      'Apuração - Profissional', (resposta: boolean) => {
        if (resposta) {

          let profissionalApuracaoExcluirIn = {
            codigoApuracao : this.codigoProfissionalApuracao,
            codigoUsuarioAlteracao: this.codigoUsuario
          } as ProfissionalApuracaoExcluirIn;
          
          this.inscricaoExcluir$ = this.profissionalApuracaoService.apagar(profissionalApuracaoExcluirIn)
                                                                   .subscribe(result=>
                                                                    {
                                                                      if(result){
                                                                        this.handlerSucesso('Apuração apagada com sucesso!');
                                                                        setTimeout(() => {
                                                                          this.retornar();
                                                                        }, 3000);
                                                                      }
                                                                    });
        }
      }, 'Sim', 'Não'
    );
  }
  openDialogBaixa(){
    this.alertService.openConfirmModal('Por favor, confirmar se deseja continuar com a apuração?', 'Apuração - Profissional', (resposta: boolean) => {
        if (resposta) 
        {

        }
      }, 'Sim', 'Não');
  }
  retornar(){
    this.router.navigate(['/profissional-apuracao']);
  }
  handlerSucesso(mensagem: string){
    this.serviceAlert.mensagemSucesso(mensagem);
  }
}
