import { TipoServicoService } from './../../tipo-servico/tipo-servico.service';
import { Subscription } from 'rxjs';
import { ServicosService } from './../servicos.service';
import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { BaseFormComponent } from 'src/app/shared/base-form/base-form.component';
import { Servico } from '../servico';
import { TipoServico } from 'src/app/tipo-servico/tipo-servico';

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
      descricao : [null, [Validators.required]],
      valor : [1,[Validators.required]],
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
  openConfirmExclusao(){

  }
  retornar(){
    this.router.navigate(['/servico']);
  }
}
