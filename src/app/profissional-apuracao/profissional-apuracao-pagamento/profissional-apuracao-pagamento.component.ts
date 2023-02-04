import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth-guard/auth.service';
import { FormaPagamento } from 'src/app/forma-pagamento/forma-pagamento';
import { FormaPagamentoService } from 'src/app/forma-pagamento/forma-pagamento.service';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { BaseFormComponent } from 'src/app/shared/base-form/base-form.component';
import { ProfissionalApuracaoPagamento } from './profissional-apuracao-pagamento';
import { ProfissionalApuracaoPagamentoIn } from './profissional-apuracao-pagamento-In';
import { ProfissionalApuracaoPagamentoService } from './profissional-apuracao-pagamento.service';

@Component({
  selector: 'app-profissional-apuracao-pagamento',
  templateUrl: './profissional-apuracao-pagamento.component.html',
  styleUrls: ['./profissional-apuracao-pagamento.component.scss']
})
export class ProfissionalApuracaoPagamentoComponent extends BaseFormComponent implements OnInit,OnDestroy {
 
  formulario: FormGroup;
  formasPagto: FormaPagamento[]=[];
  inscricao$ : Subscription;
  inscricaoForma$: Subscription;
  inscricaoPagamento$: Subscription;
  valorMaximo: number;
  valorTotalPagoBase: number;
  valorTotalApuracao: number;  
  codigoUsuario: number;
 
  listaPagamentos: ProfissionalApuracaoPagamento[]=[];

  constructor(@Inject(MAT_DIALOG_DATA) public data: ProfissionalApuracaoPagamentoIn,
              private alertService: AlertService,
              private formBuilder: FormBuilder,
              private profissionalApuracaoPagamentoService: ProfissionalApuracaoPagamentoService,
              private formasPagamentoService: FormaPagamentoService ,
              private authService: AuthService) {
    super();
  }
  
  ngOnInit(): void {
    this.recuperarLancamentosPagamento();
    this.recuperarFormasPagamento();
    this.valorTotalApuracao = this.data.valorTotalApuracao;
    this.valorMaximo = this.data.valorTotalApuracao;
    this.valorTotalPagoBase = 0;
    this.authService.getUserData();
    this.codigoUsuario = Number.parseInt(this.authService.usuarioLogado.codigo);
    this.criacaoFormulario();    
  }
  ngOnDestroy(): void{
    if (this.inscricao$){
      this.inscricao$.unsubscribe();
    }
    if(this.inscricaoForma$){
      this.inscricaoForma$.unsubscribe();
    }
    if (this.inscricaoPagamento$){
      this.inscricaoPagamento$.unsubscribe();
    }
  }
  criacaoFormulario(){     
    //formulario cliente
    this.formulario = this.formBuilder.group({          
     codigoFormaPagamento: [null, Validators.required],     
     valorAPagar:[0, [Validators.required]],
     observacao: [null]      
    });    
  }   
  recuperarFormasPagamento(){
    this.inscricaoForma$ = this.formasPagamentoService.list<FormaPagamento[]>()
                                                      .subscribe(result=>{
                                                        this.formasPagto = result;
                                                      },error=>{
                                                        console.log(error);
                                                        this.handleError('Ocorreu um erro ao recuperar a forma de pagmento.');
                                                      })
  }
  recuperarLancamentosPagamento(){
    this.inscricao$ = this.profissionalApuracaoPagamentoService.recuperarLista(this.data.codigoApuracao)
                                                               .subscribe(result=>{
                                                                this.listaPagamentos = result;
                                                                this.calcularVAlorPago();
                                                               },error=>{
                                                                console.log(error);
                                                                this.handleError('Ocorreu um erro ao tentar recuperar a lista de pagamentos.');
                                                               });
  }
  submit() {
    
    let valueSubmit = Object.assign({}, this.formulario.value);
    let valorTotal =  this.valorTotalApuracao;;
    let valorPago = this.valorTotalPagoBase;
    let valorAPagar = Number.parseFloat(valueSubmit.valorAPagar.replace(',','.'));
    let codigoFormaPagamentoGravar = valueSubmit.codigoFormaPagamento;
    let observacaoGravar  = valueSubmit.observacao;
    
    //validações
    if((valorTotal-valorPago)< valorAPagar){
      this.handlerExclamacao('Atenção!O valor a pagar é maior do que o total + pago. Por favor, verifique.');
      return false;
    }
    //gravar efetivamente.
    this.alertService.openConfirmModal('Por favor, confirmar se deseja continuar com a apuração?', 'Apuração - Profissional', (resposta: boolean) => {
      if (resposta) {
        let dadoSalvar = {
          codigo : 0 ,
          codigoApuracao : this.data.codigoApuracao,
          codigoFormaPagamento : codigoFormaPagamentoGravar,
          observacao : observacaoGravar,
          codigoSituacaoPagamento : 0,
          codigoUsuarioBaixa : this.codigoUsuario,
          dataBaixa: new Date(),
          valorPago: valorAPagar
        } as ProfissionalApuracaoPagamento;

        this.inscricaoPagamento$ = this.profissionalApuracaoPagamentoService.save(dadoSalvar)
                                                                            .subscribe(result=>{
                                                                              if(result){
                                                                                this.handlerSucesso("Registro salvo com sucesso!");
                                                                                this.formulario.controls["valorAPagar"].setValue("0");
                                                                                this.formulario.controls["observacao"].setValue('');
                                                                                this.recuperarFormasPagamento();
                                                                              }
                                                                            },error=>{
                                                                              console.log(error);
                                                                              this.handleError('Ocorreu um erro ao tentar salvar os registros.');
                                                                            });
      }
    }, 'Sim', 'Não');
  }
  allowNumericDigitsOnlyOnKeyUp(e) {		
		const charCode = e.which ? e.which : e.keyCode;
		if (charCode !== 190 && charCode !== 46 && charCode!==44){
      if (charCode > 31  && (charCode < 48 || charCode > 57)) {
        this.handleError("Por favor, informar apenas numeros e casas decimais");        
      }
    }	 
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
  calcularValorAPagar(){    
   /*  if(this.formulario.get('valorTotalDesconto').value == undefined ||
    this.formulario.get('valorTotalDesconto').value == null)
      this.formulario.controls['valorTotalDesconto'].setValue('0');
      
    if(this.formulario.get('valorTotalAcrescimo').value == undefined ||
    this.formulario.get('valorTotalAcrescimo').value == null )
      this.formulario.controls['valorTotalAcrescimo'].setValue('0');
      
    let valorDesconto = this.formulario.get('valorTotalDesconto').value!= undefined?Number.parseFloat(this.formulario.get('valorTotalDesconto').value): 0;
    let valorTotalAcrescimo = this.formulario.get('valorTotalAcrescimo').value!= undefined?Number.parseFloat(this.formulario.get('valorTotalAcrescimo').value): 0;
    let valorTotalServico = this.formulario.get('valorTotalServico').value!= undefined?Number.parseFloat(this.formulario.get('valorTotalServico').value): 0;

    let valorAPagar = ((valorTotalServico+ valorTotalAcrescimo)  - valorDesconto);
    this.formulario.controls['valorAPagar'].setValue(valorAPagar.toFixed(2)); */
  }
  calcularVAlorPago(){
    this.valorTotalPagoBase =0;
    this.listaPagamentos.forEach(pag=>{
      this.valorTotalPagoBase = this.valorTotalPagoBase + pag.valorPago;
    });
    this.formulario.controls["valorTotalPago"].setValue(this.valorTotalPagoBase);
  }
}
