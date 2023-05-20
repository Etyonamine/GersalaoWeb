import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth-guard/auth.service';
import { BaseFormComponent } from 'src/app/shared/base-form/base-form.component';
import { Situacao } from 'src/app/situacao/situacao';
import { SituacaoService } from 'src/app/situacao/situacao.service';
import { AgendaReportService } from './agenda-report.service';

@Component({
  selector: 'app-agenda-report',
  templateUrl: './agenda-report.component.html',
  styleUrls: ['./agenda-report.component.scss']
})
export class AgendaReportComponent extends BaseFormComponent implements OnInit,OnDestroy {
 
  nomeUsuario : string ='';
  type = 'application/pdf' ;
  inscricao$:Subscription;
  inscricaoAuth$:Subscription;
  inscricaoSituacao$: Subscription;

  formulario: FormGroup;
  optionSituacao : Array<Situacao> = []

  //variaveis do periodo ----------------
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });

  constructor(private formBuilder: FormBuilder,    
              private authService : AuthService,
              private agendaReportService: AgendaReportService,
              private situacaoService: SituacaoService) {
    super();
  }
 
  ngOnInit(): void {
    this.nomeUsuario = this.authService.usuarioLogado.login;
    this.criarFormulario();
    this.listarSituacoes();
    this.iniciarRange();
  }

  ngOnDestroy(): void {
    if (this.inscricao$){
      this.inscricao$.unsubscribe();
    }
    if (this.inscricaoAuth$){
      this.inscricaoAuth$.unsubscribe();
    }
    if (this.inscricaoSituacao$){
      this.inscricaoSituacao$.unsubscribe();
    }
  }

 // criação dos formularios ************************************************
  criarFormulario() {
    
    this.formulario = this.formBuilder.group({
      dataInicio: [new Date()],
      dataFim: [new Date()],
      codigoSituacao: [0]      
    });
  }
  
  listarSituacoes(){
    this.inscricaoSituacao$ = this.situacaoService.listaPorTipo(2)
                                                  .subscribe(result=>{
                                                    this.optionSituacao = result;
                                                  });
  }
 
  gerarRelatorio(){
    let periodo = this.range.value;
    let inicio = periodo.start;
    let fim = periodo.end;
    let codigoSituacao = this.formulario.get("codigoSituacao").value;

    this.inscricao$ = this.agendaReportService.gerarLista(this.nomeUsuario, inicio, fim, codigoSituacao).subscribe(respData => {
      this.downLoadFile(respData, this.type);
    },error=>{
      console.log(error);
    }
    );
  }

   /**
 * Method is use to download file from server.
 * @param data - Array Buffer data
 * @param type - type of the document.
 */
  downLoadFile(data: any, type: string) {
    var blob = new Blob([data], { type: type.toString() });
    var url = window.URL.createObjectURL(blob);
    var pwa = window.open(url);
    if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
        alert('Por favor, desbloquear o pop-up e tentar novamente.');
    }
  }

  iniciarRange(){
    let dataAtual = new Date();
    let dataFim = new Date();
    dataAtual.setDate(dataAtual.getDate() - 7);
    this.range.controls['start'].setValue(dataAtual);
    this.range.controls['end'].setValue(dataFim);
  } 

  submit() {
    this.gerarRelatorio();
  }
}
