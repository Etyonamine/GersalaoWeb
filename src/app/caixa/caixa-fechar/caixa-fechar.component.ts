import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, SubscribableOrPromise, Subscription } from 'rxjs';
import { AgendaServicoPagamentoEstorno } from 'src/app/agenda-estorno/agenda-servico-pagamento-estorno';
import { AgendaServicoPagamentoEstornoService } from 'src/app/agenda-estorno/agenda-servico-pagamento-estorno.service';
import { AgendaPagamentoService } from 'src/app/agenda-pagamento/agenda-pagamento.service';
import { AuthService } from 'src/app/auth-guard/auth.service';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { BaseFormComponent } from 'src/app/shared/base-form/base-form.component';
import { ApiResult } from 'src/app/shared/base.service';
import { Caixa } from '../caixa';
import { CaixaDetalhe } from '../caixa-detalhe';
import { CaixaLancamentoManualIn } from '../caixa-lancamento-manual/caixa-lancamento-manual-in';
import { CaixaLancamentoManualComponent } from '../caixa-lancamento-manual/caixa-lancamento-manual.component';
import { CaixaTipoLancamento } from '../caixa-tipo-lancamento';
import { CaixaTipoLancamentoService } from '../caixa-tipo-lancamento.service';
import { CaixaDetalheService } from '../caixaDetalhe.service';
import { CaixaDetalhePrevia } from './caixa-detalhe-previa';

@Component({
  selector: 'app-caixa-fechar',
  templateUrl: './caixa-fechar.component.html',
  styleUrls: ['./caixa-fechar.component.scss']
})
export class CaixaFecharComponent extends BaseFormComponent implements OnInit {
 
  caixa: Caixa;
  listaDetalhes: MatTableDataSource<CaixaDetalhe>;
  listaTiposLancamentos: CaixaTipoLancamento[]=[];
  listaPrevia: CaixaDetalhePrevia[];

  listaPagamentosServicos: AgendaPagamentoService[];
  listaEstornosServicos: AgendaServicoPagamentoEstorno[];

  colunasPrevia: string[] = [ "tipo", "valor"];

  defaultFilterColumn: string = "codigoTipoLancamento";
  filterQuery: string = null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;  
  colunas: string[] = [ "tipo", "valor", "observacao","acao"];
  defaultPageIndex: number = 0;
  defaultPageSize: number = 10;
  public defaultSortColumn: string = "codigoTipoLancamento";
  public defaultSortOrder: string = "desc";
  


  formulario: FormGroup;

  inscricao$: Subscription;
  inscricaoTipo$: Subscription;
  inscricaoPagamento$: Subscription;
  inscricaoEstorno$: Subscription;

  codigoCaixa: number;
  codigoUsuario: number;
  caixaFechado: boolean = false;

  valorFinal : number;

  constructor(private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private alertService: AlertService,
              private router:Router,
              private caixaDetalheService: CaixaDetalheService,
              private caixaTipoDetalheService: CaixaTipoLancamentoService,
              public dialog: MatDialog,
              private authService: AuthService,
              private agendaPagamentoService: AgendaPagamentoService,
              private agendaPagamentoEstornoService: AgendaServicoPagamentoEstornoService) {
    super();
  }
  ngOnInit(): void {
    this.caixaFechado = false;
    this.valorFinal = 0;
    this.caixa = this.route.snapshot.data['caixa'];    
    this.codigoCaixa = this.caixa.codigo;
    this.criacaoFormulario();
    this.listarTiposLancamentos();
    this.loadData();      
    this.authService.getUserData();
    this.codigoUsuario = Number.parseInt(this.authService.usuarioLogado.codigo);


  }  
  ngOnDestroy():void{
    if (this.inscricao$){
      this.inscricao$.unsubscribe();
    }
    if (this.inscricaoTipo$){
      this.inscricaoTipo$.unsubscribe();
    }
    if (this.inscricaoEstorno$){
      this.inscricaoEstorno$.unsubscribe();
    }
    if(this.inscricaoPagamento$){
      this.inscricaoPagamento$.unsubscribe();
    }
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
    this.valorFinal = 0;

    this.inscricao$ = this.caixaDetalheService.recuperarLista<ApiResult<any>>(
      this.codigoCaixa,
      event.pageIndex,
      event.pageSize,
      sortColumn,
      sortOrder,
      filterColumn,
      filterQuery
    ).subscribe(result => {
      
      let valorCalcular : number = 0;
      this.listaDetalhes = new MatTableDataSource<CaixaDetalhe>(result.data);
      this.listaDetalhes.data.forEach(element => {
          valorCalcular = element.valor; 
          element.caixaTipoLancamento = this.listaTiposLancamentos.find(x=>x.codigo == element.codigoTipoLancamento)

          if (element.codigoTipoLancamento === 2 || element.codigoTipoLancamento === 5 ){
            valorCalcular = valorCalcular * (-1);
          }
          element.valor = valorCalcular;
          this.calcularValorFinal(valorCalcular);
      });
      this.paginator.length = result.totalCount;
      this.paginator.pageIndex = result.pageIndex;
      this.paginator.pageSize = result.pageSize;
    }, error => {
      console.error(error);
      if (error.status !== 404) {
        this.handleError('erro ao recuperar as informações de caixas detalhes.');
      } else {
        return EMPTY;
      }
    });
  }
  listarTiposLancamentos(){
    this.inscricaoTipo$ = this.caixaTipoDetalheService.list<CaixaTipoLancamento[]>()
                                                      .subscribe(result=>{
                                                        this.listaTiposLancamentos = result;
                                                      },error=>{
                                                        console.log(error);
                                                        this.handleError('Ocorreu um erro ao recuperar a lista de tipos.');
                                                      });
    
  }   
  criacaoFormulario() {
    let codigoParam = 0;    
    let observcaoParam : string = '';
    let observcaoFechamentoParam : string = '';

    let dataAberturaParam: Date  = new Date() ;
    let dataFechamentoParam: Date;
    let valorInicialParam : number = 0;
 
 
    if (this.caixa!== undefined){

      dataAberturaParam = new Date(this.caixa.dataAbertura.toString())
      codigoParam = this.caixa.codigo;
      valorInicialParam = this.caixa.valorInicial;

      if (this.caixa.dataFechamento !== undefined && this.caixa.dataFechamento !== null){
        dataFechamentoParam = new Date(this.caixa.dataFechamento.toString());
        this.caixaFechado = true;
      }
      if (this.caixa.observacao !== undefined && this.caixa.observacao!== null){
        observcaoParam = this.caixa.observacao.trim();
      }
      if (this.caixa.observacaoFechamento !== undefined && this.caixa.observacaoFechamento!== null){
        observcaoFechamentoParam = this.caixa.observacaoFechamento.trim();
      }
    }
    this.formulario = this.formBuilder.group({
      codigo: [codigoParam],
      dataAbertura: [dataAberturaParam.toLocaleString()],
      dataFechamento: [dataFechamentoParam !== undefined ? dataFechamentoParam.toLocaleString(): null],
      valorInicial:[valorInicialParam, Validators.required],      
      observacao:[observcaoParam],
      observacaoFechamento: [observcaoFechamentoParam]
    });
  }   
  allowNumericDigitsOnlyOnKeyUp(e) {		
		const charCode = e.which ? e.which : e.keyCode;
		if (charCode !== 190 && charCode !== 46 && charCode!==44){
      if (charCode > 31  && (charCode < 48 || charCode > 57)) {
        this.handleError("Por favor, informar apenas numeros e casas decimais");        
      }
    }	 
	}
  handleError(msg:string){
    this.alertService.mensagemErro(msg);
  }  
  handleSucesso(msg:string){
    this.alertService.mensagemSucesso(msg);
  }
  retornar(){
    this.router.navigate(['/caixa']);
  } 
  calcularValorFinal(valorAdicionar: number){
    let valorAtual =this.valorFinal;
    valorAtual = valorAtual + valorAdicionar;
    this.valorFinal = valorAtual;
  } 
  openDialogLancamentoManual(){
    let ultimaSequencia : number = 1; 
    if (this.listaDetalhes.data.length>0){
      let maximaSequencia =  Math.max(...this.listaDetalhes.data.map(x=>x.numeroSequencia)) + 1;
    }
    let data = {
      codigoCaixa : this.codigoCaixa,
      codigoUsuario : this.codigoUsuario, 
      ultimoNumeroSequencia : ultimaSequencia
    } as CaixaLancamentoManualIn;

     // montando o dialogo
     const dialogRef = this.dialog.open(CaixaLancamentoManualComponent,
      {width: '700px' , height: '900px;',
        data : data               
      }
    );
    dialogRef.afterClosed().subscribe(result=>{
      this.loadData();
    });
  }
  submit() {
    throw new Error('Method not implemented.');
  }
  listarServicoPagamentos(){
    //this.inscricaoPagamento$ = this.agendaPagamentoService.
  }
}
