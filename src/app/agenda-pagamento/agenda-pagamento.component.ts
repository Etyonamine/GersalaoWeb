import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth-guard/auth.service';
import { FormaPagamento } from '../forma-pagamento/forma-pagamento';
import { FormaPagamentoService } from '../forma-pagamento/forma-pagamento.service';
import { AlertService } from '../shared/alert/alert.service';
import { BaseFormComponent } from '../shared/base-form/base-form.component';
import { AgendaPagamento } from './agenda-pagamento';
import { AgendaPagamentoDetalhe } from './agenda-pagamento-detalhe/agenda-pagamento-detalhe';
import { AgendaPagamentoService } from './agenda-pagamento.service';
 
@Component({
  selector: 'app-agenda-pagamento',
  templateUrl: './agenda-pagamento.component.html',
  styleUrls: ['./agenda-pagamento.component.scss']
})
export class AgendaPagamentoComponent extends BaseFormComponent implements OnInit, OnDestroy {
  formulario: FormGroup;
  agendaPagamentoServico: AgendaPagamento;
  formasPagto: FormaPagamento[];
  valorAPagar: number;
  codigoUsuario: number;

  inscricaoFormaPagto$ : Subscription;
  inscricaoPagamento$: Subscription;

  //manipulacao da tabela
  displayedColumns: string[] = [ 'nomeProfissional', 'nomeServico', 'valorServico'];
  dataSource = new MatTableDataSource<AgendaPagamentoDetalhe>(this.data.listaDetalhes);

  constructor(@Inject(MAT_DIALOG_DATA) public data: AgendaPagamento,
              private formBuilder: FormBuilder, 
              private formaPagamentoService: FormaPagamentoService,
              private agendaPagamentoService: AgendaPagamentoService,
              private alertService: AlertService,
              private authService : AuthService)
  {
    super();
  }
  ngOnInit(): void {
      this.agendaPagamentoServico  = this.data;
      this.valorAPagar = this.agendaPagamentoServico.valorPagamento;
      this.criacaoFormulario();
      this.listaFormasPagamento();
      this.codigoUsuario =  Number.parseInt(this.authService.usuarioLogado.codigo);
  }
  ngOnDestroy():void{
    if(this.inscricaoFormaPagto$){
      this.inscricaoFormaPagto$.unsubscribe();
    }
    if (this.inscricaoPagamento$)
      this.inscricaoPagamento$.unsubscribe();
  }
  handlerSucesso(mensagem:string)
  {
    this.alertService.mensagemSucesso(mensagem);
  }
  handleError(mensagem:string)
  {
    this.alertService.mensagemErro(mensagem);
  }
  handlerExclamacao(mensagem:string){
    this.alertService.mensagemExclamation(mensagem);
  }
  criacaoFormulario(){     
    //formulario cliente
    this.formulario = this.formBuilder.group({          
     codigoFormaPagamento: [null,Validators.required],
     valorTotalServico : [{value: this.agendaPagamentoServico.valorPagamento,disabled:true },Validators.required],
     valorTotalDesconto: [0],
     valorTotalAcrescimo: [0],
     valorAPagar:[{value: this.valorAPagar, disabled : true}],
     observacao: [null]      
    });    
  }  
  listaFormasPagamento(){
    this.inscricaoFormaPagto$ = this.formaPagamentoService.list<FormaPagamento[]>()
                                                          .subscribe(result=>{
                                                              this.formasPagto = result;
                                                          },error=>{                                                            
                                                            console.log(error);
                                                          });
  }
  submit() {
    let valueSubmit = Object.assign({}, this.formulario.value);
    let valorFinalAPagar = Number.parseFloat(this.formulario.get('valorAPagar').value);

    if(  valorFinalAPagar < 0 ){
      this.handlerExclamacao('Não pode ser um valor negativo!Por favor,verificar os valores digitados.');
      return false;      
    }
    let valorTotalGravar = this.formulario.get('valor')
    let agendaServicoPagamentoGravar = {
      codigo: 0,
      codigoFormaPagamento: valueSubmit.codigoFormaPagamento, 
      codigoSituacao: 0,
      codigoUsuarioCadastro: this.codigoUsuario,
      dataCadastro: new Date(),
      observacao: valueSubmit.observacao,
      valorPagamento: valorFinalAPagar,
      valorDesconto: Number.parseFloat(valueSubmit.valorTotalDesconto),
      valorAcrescimo: Number.parseFloat(valueSubmit.valorTotalAcrescimo),
      listaDetalhes: this.agendaPagamentoServico.listaDetalhes
    } as AgendaPagamento;
    this.inscricaoPagamento$ = this.agendaPagamentoService.salvarRegistro(agendaServicoPagamentoGravar)
                                                          .subscribe(result=>{
                                                            if(result){
                                                              this.handlerSucesso('Pagamento salvo com sucesso!');
                                                            }else
                                                            {
                                                              this.handleError('Não foi salvo o pagamento.');
                                                            }
                                                          },error=>{
                                                            console.log (error);
                                                            this.handleError('Ocorreu algum erro na tentativa de salvar o registro.');
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
  calcularValorAPagar(){    
    if(this.formulario.get('valorTotalDesconto').value == undefined ||
    this.formulario.get('valorTotalDesconto').value == null)
      this.formulario.controls['valorTotalDesconto'].setValue('0');
      
    if(this.formulario.get('valorTotalAcrescimo').value == undefined ||
    this.formulario.get('valorTotalAcrescimo').value == null )
      this.formulario.controls['valorTotalAcrescimo'].setValue('0');
      
    let valorDesconto = this.formulario.get('valorTotalDesconto').value!= undefined?Number.parseFloat(this.formulario.get('valorTotalDesconto').value): 0;
    let valorTotalAcrescimo = this.formulario.get('valorTotalAcrescimo').value!= undefined?Number.parseFloat(this.formulario.get('valorTotalAcrescimo').value): 0;
    let valorTotalServico = this.formulario.get('valorTotalServico').value!= undefined?Number.parseFloat(this.formulario.get('valorTotalServico').value): 0;

    let valorAPagar = ((valorTotalServico+ valorTotalAcrescimo)  - valorDesconto);
    this.formulario.controls['valorAPagar'].setValue(valorAPagar.toFixed(2));
  }
}
