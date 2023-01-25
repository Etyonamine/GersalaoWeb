import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { of, Subscription } from 'rxjs';
import { AgendaService } from 'src/app/agenda/agenda.service';
import { AuthService } from 'src/app/auth-guard/auth.service';
import { ProfissionalService } from 'src/app/profissional/profissional.service';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { BaseFormComponent } from 'src/app/shared/base-form/base-form.component';
import { ProfissionalApuracaoIn } from '../profissional-apuracao-in';
import { ProfissionalApuracaoPendente } from '../profissional-apuracao-pendente';
import { ProfissionalApuracaoService } from '../profissional-apuracao.service';

@Component({
  selector: 'app-profissional-apuracao-form',
  templateUrl: './profissional-apuracao-form.component.html',
  styleUrls: ['./profissional-apuracao-form.component.scss']
})
export class ProfissionalApuracaoFormComponent extends BaseFormComponent implements OnInit, OnDestroy {

  formulario: FormGroup;
  inscricaoProfissional$: Subscription;
  inscricaoAgendaPendente$: Subscription;
  inscricaoProfissionalApuracao$: Subscription;
  valorServicoTotal: number;
  valorComissaoTotal: number;
  codigoUsuario: number;
  
  minDate: Date;
  maxDate: Date;
 
 

  optionProfissionais: ProfissionalApuracaoPendente[];

  constructor(private formBuilder: FormBuilder,
    private profissionalService: ProfissionalService,
    private alertService: AlertService,
    private agendaService: AgendaService,
    private profissionalApuracaoService: ProfissionalApuracaoService,
    private authService: AuthService,
    private router: Router,) {
    super();
  }

  ngOnInit(): void {
    this.listaProfissionais();
    this.criacaoFormulario();
    this.minDate = new Date();
    this.minDate.setMonth(this.minDate.getMonth() - 6);
    this.maxDate = new Date();
    this.codigoUsuario = Number.parseInt(this.authService.usuarioLogado.codigo);
    
  }
  ngOnDestroy(): void {
    if (this.inscricaoProfissional$) { this.inscricaoProfissional$.unsubscribe(); }
    if (this.inscricaoAgendaPendente$) { this.inscricaoAgendaPendente$.unsubscribe(); }
    if (this.inscricaoProfissionalApuracao$) { this.inscricaoProfissionalApuracao$.unsubscribe(); }
  }
  criacaoFormulario() {
    this.formulario = this.formBuilder.group({
      codigoProfissional: [null],
      inicioPeriodo: [null],
      fimPeriodo: [null]
    });
  }
  submit() {
    if (new Date(this.formulario.get('inicioPeriodo').value) > new Date(this.formulario.get('fimPeriodo').value)){
      this.handlerAtencao('Por favor, verificar a data de inicio está MAIOR do que o fim!');
      return false;
    }    
    let profissionalApuracaoIn = {
      codigoProfissional :  this.formulario.get('codigoProfissional').value,
      codigoUsuario : this.codigoUsuario,
      inicioPeriodo : this.formulario.get('inicioPeriodo').value,
      terminoPeriodo : this.formulario.get('fimPeriodo').value 
    } as ProfissionalApuracaoIn;      
    
    this.alertService.openConfirmModal('Por favor, confirmar se deseja continuar com a apuração?', 'Apuração - Profissional', (resposta: boolean) => {
      if (resposta) {
       this.inscricaoProfissionalApuracao$ = this.profissionalApuracaoService.salvar(profissionalApuracaoIn).subscribe(result => {
        if (result > 0) {
          this.handlerSucesso('Apuração do profissional processado com sucesso!');
          setTimeout(() => {                
            this.formulario.reset();
            this.listaProfissionais();
          }, 3000);          
        } else {
          this.handlerAtencao('Ocorreu algum erro no processo de apuração.');
          return of(false);
        }
      }, error => {
        console.log(error);
        this.handlerError('Ocorreu um erro ao tentar apurar');
      }
      ); 
    }}, 'Sim', 'Não'
    ); 
  }
  listaProfissionais() {
    let inicioPeriodo = new Date();
    inicioPeriodo.setMonth(inicioPeriodo.getMonth() - 6);
    let fimPeriodo = new Date();
    this.inscricaoProfissional$ = this.profissionalService.ListarProfissionaisPendentes(inicioPeriodo, fimPeriodo)
      .subscribe(result => {
        this.optionProfissionais = result;
      }, error => {
        console.log(error);
        this.handlerError('Ocorreu um erro ao recuperar a lista de profissionais.');
      });
  }
 
  handlerError(mensagem: string) {
    this.alertService.mensagemErro(mensagem);
  }
  handlerSucesso(mensagem: string) {
    this.alertService.mensagemSucesso(mensagem);
  }
  handlerAtencao(mensagem: string) {
    this.alertService.mensagemExclamation(mensagem);
  }
  retornar() {

    this.router.navigate(['/profissional-apuracao']);

  }



}
