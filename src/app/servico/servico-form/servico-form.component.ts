import { TipoServicoService } from './../../tipo-servico/tipo-servico.service';
import { Observable, Subscription } from 'rxjs';
import { ServicosService } from './../servicos.service';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, Form, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { BaseFormComponent } from 'src/app/shared/base-form/base-form.component';
import { Servico } from '../servico';
import { TipoServico } from 'src/app/tipo-servico/tipo-servico';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-servico-form',
  templateUrl: './servico-form.component.html',
  styleUrls: ['./servico-form.component.scss']
})
export class ServicoFormComponent extends BaseFormComponent
                                              implements OnInit {

  servico : Servico;
  tipoServicos : Array<TipoServico>=[];
  formulario : FormGroup;
  codigoStatus : string = "1";

  inscricaoTipo$ : Subscription;
  HabilitarBotaoApagar: boolean = false;

  constructor(private formBuilder: FormBuilder,
    private servicoService: ServicosService,
    private tipoServicoService : TipoServicoService,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService) {
    super();
  }

  ngOnInit(): void {
    this.formulario = this.formBuilder.group({
      codigo : [],
      descricao : [null, [Validators.required], this.isDupe()],
      valor : [0,[Validators.required,Validators.min(1)]],
      codigoTipoServico:[null,[Validators.required]]
    });
      this.inscricaoTipo$ = this.tipoServicoService.list<TipoServico[]>()
                                                  .subscribe(result => this.tipoServicos = result,
                                                  error => {
                                                    console.error(error);
                                                    this.handlerErro("Ocorreu um erro na tentativa de recuperar a lista de tipos de servico.");
                                                  }
                                                     );

    }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if (this.inscricaoTipo$){
      this.inscricaoTipo$.unsubscribe;
    }
  }

  submit() {

  }

  listaTipos(){
    this.inscricaoTipo$ =
                        this.tipoServicoService.list<TipoServico[]>()
                                                 .subscribe(result => this.tipoServicos

                                                 );

  }

  handlerErro(msg:string){
    this.alertService.mensagemErro(msg);
  }
  excluirServico(){

  }
  openConfirmExclusao(){
    this.alertService.openConfirmModal('Tem certeza que deseja excluir?', 'Excluir - Cliente', (answer: boolean) => {
      if (answer) {
        this.excluirServico();
      }
    }, "Sim", "Não"
    );
  }
  retornar(){
    this.router.navigate(['/servico']);
  }
  isDupe(): AsyncValidatorFn {


    return (control: AbstractControl): Observable<ValidationErrors | null> => {

      var codigo: number = 0;
      var codigoTipo : number  = 0 ;

      if (this.formulario !== undefined) {
        codigo = this.formulario.get('codigo').value != null ? this.formulario.get('codigo').value : 0;
        codigoTipo = this.formulario.get('codigoTipoServico').value !== null? this.formulario.get('codigoTipoServico').value : 0  ;
      }
      //codigo tipo de servico

        //verificando se é um caso de ediçao ou novo registro
        var servicoValidar = (codigo) ? this.servico : <Servico>{};

        servicoValidar.descricao = this.formulario !== undefined ? this.formulario.get('descricao').value : '';

        servicoValidar.codigo = codigo;
        servicoValidar.codigoTipoServico = codigoTipo;

        return this.servicoService.isDupe(servicoValidar).pipe(map(result => {
          return (result !== false ? { isDupe: true } : null);
        }));
    }
  }

}
