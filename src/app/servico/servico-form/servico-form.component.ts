import { TipoServicoService } from './../../tipo-servico/tipo-servico.service';
import { Subscription } from 'rxjs';
import { ServicosService } from './../servicos.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { BaseFormComponent } from 'src/app/shared/base-form/base-form.component';
import { Servico } from '../servico';
import { TipoServico } from 'src/app/tipo-servico/tipo-servico';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-servico-form',
  templateUrl: './servico-form.component.html',
  styleUrls: ['./servico-form.component.scss']
})
export class ServicoFormComponent extends BaseFormComponent
  implements OnInit, OnDestroy {

  servico: Servico;
  tipoServicos: Array<TipoServico> = [];
  formulario: FormGroup;
  codigoStatus: string = "1";

  inscricaoTipo$: Subscription;
  HabilitarBotaoApagar: boolean = false;
  registroExiste: boolean = false;

  constructor(private formBuilder: FormBuilder,
    private servicoService: ServicosService,
    private tipoServicoService: TipoServicoService,
    private router: Router,
    private route: ActivatedRoute,
    private alertService: AlertService) {
    super();
  }

  ngOnInit(): void {
    this.servico = this.route.snapshot.data['servico'] ? this.route.snapshot.data['servico']:<Servico>{};

    this.formulario = this.formBuilder.group({
      codigo: [this.servico.codigo],
      descricao: [this.servico.descricao, [Validators.required]],
      valor: [this.servico.valor, [Validators.required, Validators.min(1)]],
      codigoTipoServico: [this.servico.codigoTipoServico, [Validators.required]]
    });
    this.inscricaoTipo$ = this.tipoServicoService.list<TipoServico[]>()
      .subscribe(result => this.tipoServicos = result,
        error => {
          console.error(error);
          this.handlerErro("Ocorreu um erro na tentativa de recuperar a lista de tipos de servico.");
        }
      );
      this.HabilitarBotaoApagar = this.formulario.get('codigo').value != null ? true : false;
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if (this.inscricaoTipo$) {
      this.inscricaoTipo$.unsubscribe;
    }
  }

  submit() {
    this.verificarExistencia();
    if (this.registroExiste==true) {
      this.handlerErro("O nome do serviço e tipo já existe cadastrado.");
      return;
    }

    let msgSucess = 'Cliente cadastrado com sucesso!';
    let msgError = 'Erro ao cadastrar outro cliente!';
    var codigoSituacao: number = +this.codigoStatus;

    let valueSubmitted = Object.assign({}, this.formulario.value);
    this.servico.codigo = valueSubmitted.codigo == null?0:valueSubmitted.codigo;
    this.servico.codigoSituacao = codigoSituacao;
    this.servico.codigoTipoServico = valueSubmitted.codigoTipoServico;
    this.servico.descricao = valueSubmitted.descricao.trim();
    this.servico.valor = valueSubmitted.valor;
    this.servico.codigoUsuarioCadastro = 1;


    this.servicoService.save(this.servico)
                       .subscribe(sucesso => {
                        this.handlerSuccess(msgSucess);
                        setTimeout(() => { this.retornar(); }, 3000);
                      },
                        error => {
                          console.error(error);
                          this.handlerErro("Ocorreu um erro na tentativa de salvar o cadastro.");
                        });

  }

  listaTipos() {
    this.inscricaoTipo$ =
      this.tipoServicoService.list<TipoServico[]>()
        .subscribe(result => this.tipoServicos

        );

  }

  handlerErro(msg: string) {
    this.alertService.mensagemErro(msg);
  }
  excluirServico() {
    var msgSucess: string = 'Registro excluído com sucesso!';
    var msgErro: string = 'Ocorreu um erro na tentativa de exclusão  do cliente.'

    var codigo = this.formulario.get('codigo').value;

    this.servicoService.delete(codigo).subscribe(sucesso => {
      this.handlerSuccess(msgSucess);
      setTimeout(() => { this.retornar(); }, 3000);
    }, error => {
      console.log(error);
      this.handlerErro(msgErro);
    });

  }
  openConfirmExclusao() {
    this.alertService.openConfirmModal('Tem certeza que deseja excluir?', 'Excluir - Serviço', (answer: boolean) => {
      if (answer) {
        this.excluirServico();
      }
    }, "Sim", "Não"
    );
  }

  retornar() {
    this.router.navigate(['/servico']);
  }

  verificarExistencia() {
    this.registroExiste = false;

    var codigo: number = 0;
    var codigoTipo: number = 0;
    //verificando se é um caso de ediçao ou novo registro
    var servicoValidar = (codigo) ? this.servico : <Servico>{};
    var retornoValor: boolean;

    codigo = this.formulario.get('codigo').value != null ? this.formulario.get('codigo').value : 0;
    codigoTipo = this.formulario.get('codigoTipoServico').value !== null ? this.formulario.get('codigoTipoServico').value : 0;


    servicoValidar.descricao = this.formulario !== undefined ? this.formulario.get('descricao').value : '';

    servicoValidar.codigo = codigo;
    servicoValidar.codigoTipoServico = codigoTipo;

    this.servicoService.isDupe(servicoValidar).pipe(take(1))
      .subscribe(result => {
        this.registroExiste = result;
      },
        error => {
          console.error(error);
          this.handlerErro('Erro ao validar nome e tipo de serviço.');
        });


  }
  handlerSuccess(msg: string) {
    this.alertService.mensagemSucesso(msg);
  }

}
