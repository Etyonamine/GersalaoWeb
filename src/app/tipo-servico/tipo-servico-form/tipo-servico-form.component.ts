import { TipoServicoService } from './../tipo-servico.service';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { BaseFormComponent } from 'src/app/shared/base-form/base-form.component';
import { Observable } from 'rxjs';
import { TipoServico } from '../tipo-servico';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-tipo-servico-form',
  templateUrl: './tipo-servico-form.component.html',
  styleUrls: ['./tipo-servico-form.component.scss']
})
export class TipoServicoFormComponent extends BaseFormComponent implements OnInit {


  formulario : FormGroup;
  codigoStatus : string  = "1" ;
  HabilitarBotaoApagar : boolean = false;
  tipoServico : TipoServico ;

  constructor(private formBuilder: FormBuilder,
              private tipoServicoService : TipoServicoService) {
    super();
  }

  ngOnInit(): void {

    this.formulario =  this.formBuilder.group({
      codigo :[0],
      descricao: [null, [Validators.required] , this.isDupe()]
    });
  }

  submit() {
    console.log(this.formulario);
  }

   //** validar se existe*/
   isDupe(): AsyncValidatorFn {


    return (control: AbstractControl): Observable<ValidationErrors | null> => {

      var codigo : number = 0;

      if ( this.formulario!== undefined){
        codigo = this.formulario.get('codigo').value  ;
      }else{

      }
      //verificando se é um caso de ediçao ou novo registro
      var tipoServicoValidar = (codigo) ? this.tipoServico : <TipoServico>{};

      tipoServicoValidar.descricao =this.formulario!== undefined? this.formulario.get('descricao').value : '';

      tipoServicoValidar.codigo = codigo;

      return this.tipoServicoService.isDupe(tipoServicoValidar).pipe(map(result => {
        return (result !== false  ? { isDupe : true } : null);
      }));
    }
  }
}
