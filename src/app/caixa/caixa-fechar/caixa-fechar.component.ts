import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { BaseFormComponent } from 'src/app/shared/base-form/base-form.component';
import { Caixa } from '../caixa';
import { CaixaDetalhe } from '../caixa-detalhe';
import { CaixaDetalheService } from '../caixaDetalhe.service';

@Component({
  selector: 'app-caixa-fechar',
  templateUrl: './caixa-fechar.component.html',
  styleUrls: ['./caixa-fechar.component.scss']
})
export class CaixaFecharComponent extends BaseFormComponent implements OnInit {
 
  caixa: Caixa;
  listaDetalhes: MatTableDataSource<CaixaDetalhe>;
  defaultFilterColumn: string = "dataCadastro";
  filterQuery: string = null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;  
  colunas: string[] = [ "codigo", "dataAbertura", "dataFechamento", "valorInicial", "valorFinal" ,"acao"];
  defaultPageIndex: number = 0;
  defaultPageSize: number = 10;
  public defaultSortColumn: string = "dataAbertura";
  public defaultSortOrder: string = "desc";
  
  formulario: FormGroup;

  inscricao$: Subscription;
  codigoCaixa: number;

  constructor(private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private alertService: AlertService,
              private router:Router,
              private caixaDetalheService: CaixaDetalheService) {
    super();
  }
  ngOnInit(): void {
    this.caixa = this.route.snapshot.data['caixa'];    
    this.codigoCaixa = this.caixa.codigo;
    this.criacaoFormulario();
    this.recuperarListaDetalhe();
  }  
  recuperarListaDetalhe(){
    this.inscricao$ = this.caixaDetalheService.recuperarLista(this.codigoCaixa)
                                              .subscribe(result=>{
                                                this.listaDetalhes = result;
                                              });

  }
  criacaoFormulario() {
    let codigoParam = 0;    
    let observcaoParam : string = '';
    let dataAberturaParam: Date  = new Date() ;
    let valorInicialParam : number = 0;

    if (this.caixa!== undefined && (this.caixa.observacao !== undefined && this.caixa.observacao!== null) ){
      observcaoParam = this.caixa.observacao.trim();
    }
    if (this.caixa!== undefined){
      dataAberturaParam = new Date(this.caixa.dataAbertura.toString())
      codigoParam = this.caixa.codigo;
      valorInicialParam = this.caixa.valorInicial;
    }
    this.formulario = this.formBuilder.group({
      codigo: [codigoParam],
      dataAbertura: [dataAberturaParam.toLocaleString()],
      valorInicial:[valorInicialParam, Validators.required],
      valorFinal: [0,Validators.required],
      observacao:[observcaoParam],
      observacaoFechamento: [ null]
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
  submit() {
    throw new Error('Method not implemented.');
  }
}
