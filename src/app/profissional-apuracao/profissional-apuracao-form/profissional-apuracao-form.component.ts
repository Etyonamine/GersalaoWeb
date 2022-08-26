import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { dateInputsHaveChanged } from '@angular/material/datepicker/datepicker-input-base';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { subscribeOn } from 'rxjs/operators';
import { Agenda } from 'src/app/agenda/agenda';
import { AgendaApurar } from 'src/app/agenda/agenda-apurar';
import { AgendaService } from 'src/app/agenda/agenda.service';
import { ProfissionalService } from 'src/app/profissional/profissional.service';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { BaseFormComponent } from 'src/app/shared/base-form/base-form.component';
import { ApiResult } from 'src/app/shared/base.service';
import { ProfissionalApuracaoPendente } from '../profissional-apuracao-pendente';

@Component({
  selector: 'app-profissional-apuracao-form',
  templateUrl: './profissional-apuracao-form.component.html',
  styleUrls: ['./profissional-apuracao-form.component.scss']
})
export class ProfissionalApuracaoFormComponent extends BaseFormComponent implements OnInit,OnDestroy {
  
  formulario: FormGroup;
  inscricaoProfissional$: Subscription;
  inscricaoAgendaPendente$: Subscription;

  valorServicoTotal : number;
  valorComissaoTotal: number;


  minDate:Date;
  maxDate:Date;
  
  //variaveis da tabela e paginacao
  agendas : MatTableDataSource<AgendaApurar>;

  colunas:string[] = ["data" , "cliente", "servico", "valor", "percentual","comissao"];

  defaultPageIndex :number = 0 ;
  defaultPageSize:number = 10;

  public defaultSortColumn:string = "data";
  public defaultSortOrder:string = "asc";

  defaultFilterColumn: string= null;
  filterQuery:string=null;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort:MatSort;
  
  optionProfissionais: ProfissionalApuracaoPendente[];

  constructor(private formBuilder: FormBuilder,
              private profissionalService : ProfissionalService ,
              private alertService: AlertService,
              private agendaService: AgendaService,
              private router: Router,) {
    super();
  }

  ngOnInit(): void {
    this.listaProfissionais();
    this.criacaoFormulario();
    this.minDate = new Date();
    this.minDate.setMonth(this.minDate.getMonth()-6);
    this.maxDate = new Date();
  }
  ngOnDestroy(): void{
    if (this.inscricaoProfissional$){this.inscricaoProfissional$.unsubscribe();}
    if (this.inscricaoAgendaPendente$){this.inscricaoAgendaPendente$.unsubscribe();}
  }
  criacaoFormulario(){
    this.formulario = this.formBuilder.group({
      codigoProfissional: [null],
      inicioPeriodo: [null],
      fimPeriodo: [null]
    });
  }
  submit() {
    throw new Error('Method not implemented.');
  }
  listaProfissionais(){
    let inicioPeriodo  = new Date();
    inicioPeriodo.setMonth(inicioPeriodo.getMonth()-6);
    let fimPeriodo = new Date();
    this.inscricaoProfissional$ = this.profissionalService.ListarProfissionaisPendentes(inicioPeriodo, fimPeriodo)
                                                          .subscribe(result=>{
                                                            this.optionProfissionais = result;
                                                          },error=>{
                                                            console.log (error);
                                                            this.handlerError('Ocorreu um erro ao recuperar a lista de profissionais.');
                                                        });
  }
   
  loadData(query:string = null){
    var pageEvent = new PageEvent();
    pageEvent.pageIndex= this.defaultPageIndex;
    pageEvent.pageSize=this.defaultPageSize;
    this.filterQuery = null;

    if (query!== null && query.toString().trim()!==''){
      this.filterQuery=query;
    }

    this.getData(pageEvent);
  }
  getData(event:PageEvent){
    this.valorServicoTotal = 0;
    this.valorComissaoTotal = 0;

    let codigoProfissional = this.formulario.get("codigoProfissional").value;
    let inicioPeriodoPar = this.formulario.get("inicioPeriodo").value;
    let fimPeriodoPar = this.formulario.get("fimPeriodo").value;
    var sortColumn = (this.sort)?this.sort.active:this.defaultSortColumn;
    var sortOrder = (this.sort)?this.sort.direction:this.defaultSortOrder;
    var filterColumn =(this.filterQuery)?this.defaultFilterColumn:null;
    var filterQuery=(this.filterQuery)?this.filterQuery:null;
    
    this.inscricaoAgendaPendente$ = this.agendaService.listarAgendasPendentesApuracaoPorProfissional<ApiResult<any>>(codigoProfissional,
                                                                                inicioPeriodoPar,
                                                                                fimPeriodoPar,
                                                                                event.pageIndex,
                                                                                event.pageSize,
                                                                                sortColumn,
                                                                                sortOrder,
                                                                                filterColumn,
                                                                                filterQuery)
                                                      .subscribe(result=>{
                                                        this.agendas = new MatTableDataSource<AgendaApurar>(result.data);                                                        
                                                         this.paginator.length = result.totalCount; 
                                                        this.paginator.pageIndex = result.pageIndex;
                                                        this.paginator.pageSize = result.pageSize;
                                                        if (result.totalCount > 0 ){
                                                          this.valorServicoTotal = result.data.reduce((sum,current)=>sum + current.valor,0);
                                                          this.valorComissaoTotal = result.data.reduce((sum,current)=>sum + (current.valor * (current.valorComissaoPercentual/100)),0);
                                                        }
                                                      }, error=>{
                                                        console.log(error);
                                                        
                                                      })
  }
  handlerError(mensagem:string){
    this.alertService.mensagemErro(mensagem);
  }
  retornar(){
    
      this.router.navigate(['/profissional-apuracao']);
    
  }

}
