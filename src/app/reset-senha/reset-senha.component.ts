import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { timeStamp } from 'console';
import { Subscription } from 'rxjs';
import { BaseFormComponent } from '../shared/base-form/base-form.component';
import { UsuarioService } from '../usuario/usuario.service';

@Component({
  selector: 'app-reset-senha',
  templateUrl: './reset-senha.component.html',
  styleUrls: ['./reset-senha.component.scss']
})
export class ResetSenhaComponent extends BaseFormComponent  implements OnInit, OnDestroy {
  
  submit() {
    throw new Error('Method not implemented.');
  }
  
  formulario:FormGroup;
  inscricaoUsuarioService$: Subscription;

  constructor(private formBuilder: FormBuilder,
              private usuarioService: UsuarioService
              ) {
    super();
   }

  ngOnInit(): void {
    this.criarFormulario();
  }

  ngOnDestroy():void{
    if (this.inscricaoUsuarioService$)
    {
      this.inscricaoUsuarioService$.unsubscribe();
    }
  }

  criarFormulario(){
    //formulario cliente
    this.formulario = this.formBuilder.group({
      email: [null, [Validators.required,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]]    
    });
  }
  validarSenhaCadastro(){
    var email = this.formulario.get("email").value;
    //pesquisar na base de dados na tabela do usuario.
    

  }
}
