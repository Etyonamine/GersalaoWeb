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
  codigoStatus : number =1;

  inscricaoTipo$ : Subscription;

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
      valor : [0,[Validators.required]]
    });
  }

  submit() {

  }

  listaTipos(){
    this.inscricaoTipo$ =
                        this.tipoServicoService.list<TipoServico[]>()
                                                 .subscribe(result => this.tipoServicos

                                                 );

  }
}
