import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { BaseFormComponent } from 'src/app/shared/base-form/base-form.component';
import { Usuario } from '../usuario';

@Component({
  selector: 'app-usuario-alterar-senha',
  templateUrl: './usuario-alterar-senha.component.html',
  styleUrls: ['./usuario-alterar-senha.component.scss']
})
export class UsuarioAlterarSenhaComponent extends BaseFormComponent implements OnInit {
  submit() {
    this.alterar();
  }
  usuario : Usuario ;
  formulario:FormGroup;
  hide = true;
  
  constructor(private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private serviceAlert: AlertService) { super(); }
  
  ngOnInit(): void {
    this.usuario = this.route.snapshot.data['usuario'];
    this.criacaoFormulario();
  }
  criacaoFormulario(){
    
    //formulario cliente
    this.formulario = this.formBuilder.group({
      novaSenha: [null, Validators.required],
      repetirSenha: [null, Validators.required]
    });
  }
  alterar(){
    if (this.formulario.get('novaSenha').value !== this.formulario.get('repetirSenha').value){
      this.handleError('As senhas digitadas são diferentes!');
      return false;
    }else{
      this.handlerSucesso('Senha informada corretamente!');
    }

  }
  handlerSucesso(mensagem:string)
  {
    this.serviceAlert.mensagemSucesso(mensagem);
  }
  handleError(mensagem:string)
  {
    this.serviceAlert.mensagemErro(mensagem);
  }

}
