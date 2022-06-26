import { AlertService } from './../../shared/alert/alert.service';
import { TipoServicoService } from './../tipo-servico.service';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { BaseFormComponent } from 'src/app/shared/base-form/base-form.component';
import { Observable, of, Subscription } from 'rxjs';
import { TipoServico } from '../tipo-servico';
import { map } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-tipo-servico-form',
  templateUrl: './tipo-servico-form.component.html',
  styleUrls: ['./tipo-servico-form.component.scss']
})
export class TipoServicoFormComponent extends BaseFormComponent implements OnInit, OnDestroy {

  codigo: number = 0;
  formulario: FormGroup;
  codigoStatus: string = "1";
  HabilitarBotaoApagar: boolean = false;
  tipoServico: TipoServico;
  salvarRegistro$: Subscription;

  constructor(private formBuilder: FormBuilder,
    private tipoServicoService: TipoServicoService,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService) {
    super();
  }

  ngOnInit(): void {


    this.tipoServico = this.route.snapshot.data['tipoServico'] ? this.route.snapshot.data['tipoServico'] : <TipoServico>{};
    this.codigo = this.tipoServico.codigo !== undefined ? this.tipoServico.codigo : 0;
    this.formulario = this.formBuilder.group({
      codigo: [this.codigo],
      descricao: [this.tipoServico.descricao, [Validators.required], this.isDupe()]
    });

    if (this.tipoServico.codigoSituacao != null) {
      this.HabilitarBotaoApagar = true;
      this.codigoStatus = this.tipoServico.codigoSituacao.toString();
    }

  }

  ngOnDestroy(): void {
    if (this.salvarRegistro$) {
      this.salvarRegistro$.unsubscribe();
    }

  }
  submit() {

    let codigoSituacao: number = +this.codigoStatus;

    // mensagens
    let msgSucess = 'Cliente cadastrado com sucesso!';
    let msgError = 'Erro ao cadastrar outro cliente!';

    if (this.formulario.get('codigo').value > 0) {
      msgSucess = 'Cadastro atualizado com sucesso!';
      msgError = 'Erro ao atualizar o cadastro!';
    }


    this.tipoServico.descricao = this.formulario.get('descricao').value;
    this.tipoServico.codigo = this.formulario.get('codigo').value;
    this.tipoServico.codigoSituacao = codigoSituacao;
    this.tipoServico.dataCadastro = new Date();

    this.salvarRegistro$ = this.tipoServicoService.save(this.tipoServico)
      .subscribe(sucesso => {
        this.handlerSuccess(msgSucess);
        setTimeout(() => { this.retornar(); }, 3000);
      },
        error => {
          console.error(error);
          this.handleError("Ocorreu um erro na tentativa de salvar o cadastro.");
        });
  }

  handlerSuccess(msg: string) {
    this.alertService.mensagemSucesso(msg);
  }

  handleError(msg: string) {
    this.alertService.mensagemErro(msg);
  }

  retornar() {
    this.router.navigate(['/tipo-servico']);
  }

  //** validar se existe*/
  isDupe(): AsyncValidatorFn {


    return (control: AbstractControl): Observable<ValidationErrors | null> => {

      var codigo: number = 0;

      if (this.formulario !== undefined) {
        codigo = this.formulario.get('codigo').value != null ? this.formulario.get('codigo').value : 0;
      }

        //verificando se é um caso de ediçao ou novo registro
        var tipoServicoValidar = (codigo) ? this.tipoServico : <TipoServico>{};

        tipoServicoValidar.descricao = this.formulario !== undefined ? this.formulario.get('descricao').value : '';

        tipoServicoValidar.codigo = codigo;

        return this.tipoServicoService.isDupe(tipoServicoValidar).pipe(map(result => {
          return (result !== false ? { isDupe: true } : null);
        }));
    }
  }

  openConfirmExclusao() {
    this.alertService.openConfirmModal('Tem certeza que deseja excluir?', 'Excluir - Cliente', (answer: boolean) => {
      if (answer) {
        this.exclusaoTipo();
      }
    }, "Sim", "Não"
    );
  }

  exclusaoTipo() {

    var msgSucess: string = 'Registro excluído com sucesso!';
    var msgErro: string = 'Ocorreu um erro na tentativa de exclusão  do cliente.'

    var codigo = this.formulario.get('codigo').value;

    this.tipoServicoService.delete(codigo).subscribe(sucesso => {
      this.handlerSuccess(msgSucess);
      setTimeout(() => { this.retornar(); }, 3000);
    }, error => {
      console.log(error);
      this.handleError(msgErro);
    });

  }
}
