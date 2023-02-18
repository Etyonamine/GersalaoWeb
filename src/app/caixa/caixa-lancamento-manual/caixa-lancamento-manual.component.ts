import { Component, Inject, OnInit } from '@angular/core';
import { dateInputsHaveChanged } from '@angular/material/datepicker/datepicker-input-base';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscribable, Subscription } from 'rxjs';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { CaixaDetalhe } from '../caixa-detalhe';
import { CaixaDetalheService } from '../caixaDetalhe.service';
import { CaixaLancamentoManualIn } from './caixa-lancamento-manual-in';

@Component({
  selector: 'app-caixa-lancamento-manual',
  templateUrl: './caixa-lancamento-manual.component.html',
  styleUrls: ['./caixa-lancamento-manual.component.scss']
})
export class CaixaLancamentoManualComponent implements OnInit {

  descricao: string;
  valor: number;
  numeroSequencia:number;
  listaLancamento: CaixaDetalhe[] = [];
  codigoTipoEntrada : number = 0;

  inscricao$: Subscription;


  constructor(private alertService: AlertService,
              @Inject(MAT_DIALOG_DATA) public data: CaixaLancamentoManualIn,
              private caixaDetalheService: CaixaDetalheService) { }

  ngOnInit(): void {
    this.valor = 0;
    this.numeroSequencia = 0 ;
    this.descricao = '';
    
  }
  adicionarLista(){
    //valor
    if (this.valor ==0 ){
      this.handlerError('Por favor, informar o valor do lançamento manual.');
      return false;
    }
    //descricao
    if(this.descricao === '' || this.descricao===undefined){
      this.handlerError('Por favor, informar o motivo do lançamento manual.');
      return false;
    }

    let numeroSequencia : number;
    if (this.listaLancamento.length ===0 ){
      this.numeroSequencia = this.data.ultimoNumeroSequencia + 1;  
    }else{
      this.numeroSequencia = this.numeroSequencia + 1; 
    } 
        
    let lancamento = {
      codigoCaixa : this.data.codigoCaixa,
      codigoTipoLancamento : 3,
      numeroSequencia : this.numeroSequencia,
      codigoUsuarioCadastro : this.data.codigoUsuario,
      valor : this.valor, 
      observacao : this.descricao,
      dataCadastro : new Date()      
    }as CaixaDetalhe;

    this.listaLancamento.push(
      lancamento
      );
    //limpando as variaveis 
    this.descricao = '';
    this.valor  = 0;
    this.handlerSucesso('Lançamento incluido com sucesso!');
  }

  handlerError(message:string){
    this.alertService.mensagemErro(message);
  }
  handlerSucesso(message:string){
    this.alertService.mensagemSucesso(message);
  }
  allowNumericDigitsOnlyOnKeyUp(e) {		
		const charCode = e.which ? e.which : e.keyCode;
		if (charCode !== 190 && charCode !== 46 && charCode!==44){
      if (charCode > 31  && (charCode < 48 || charCode > 57)) {
        this.handlerError("Por favor, informar apenas numeros e casas decimais");        
      }
    }	 
	}
  salvarRegistro(){
    //validação.
    //tipo de entrada
    if (this.codigoTipoEntrada ==undefined || this.codigoTipoEntrada ===0){
      this.handlerError('Por favor, selecione o tipo de lançamento!');
      return false;
    }    
    //valor
    if (this.valor <= 0 ){
      this.handlerError('Por favor, informar o valor.');
      return false;
    }
    //descricao
    if(this.descricao === undefined || this.descricao== ''){
      this.handlerError('Por favor, informar o motivo do lançamento manual.');
      return false;
    }

    let valorGravar : number; 
    valorGravar = this.valor;
    
    if (this.codigoTipoEntrada ==2){
      valorGravar = this.valor * (-1);
    }
    //criando a objeto a gravar
    let caixaDetalheGravar ={
      codigoCaixa: this.data.codigoCaixa,
      codigoUsuarioCadastro: this.data.codigoUsuario,
      valor : valorGravar, 
      observacao: this.descricao,
      dataCadastro : new Date(),
      codigoTipoLancamento : 3,
      numeroSequencia : 0
    } as CaixaDetalhe;

    this.alertService.openConfirmModal('Por favor, confirmar se deseja continuar o lançamenot manual?', 'Salvar registro', (resposta: boolean) => {
      if (resposta) {
          this.caixaDetalheService.salvarLancamentoManual(caixaDetalheGravar)
                                  .subscribe(result=>{
                                    if(result){
                                      this.handlerSucesso('Registro salvo com sucesso!');
                                      this.valor = 0;
                                      this.codigoTipoEntrada = 0;
                                      this.descricao = '';
                                    }else{
                                      this.handlerError('Ocorreu alguma coisas errada ao tentar salvar!');                                      
                                    }
                                  },error=>{
                                    console.log(error);
                                    this.handlerError('Ocorreu alguma coisas errada ao tentar salvar!'); 
                                  })
      }}, 'Sim', 'Não'
      );
  }
}
