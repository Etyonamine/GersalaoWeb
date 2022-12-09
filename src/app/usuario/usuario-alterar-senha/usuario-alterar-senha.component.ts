import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of, Subscription } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth-guard/auth.service';
import { Login } from 'src/app/login/login';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { BaseFormComponent } from 'src/app/shared/base-form/base-form.component';
import { Usuario } from '../usuario';
import { UsuarioService } from '../usuario.service';

@Component({
  selector: 'app-usuario-alterar-senha',
  templateUrl: './usuario-alterar-senha.component.html',
  styleUrls: ['./usuario-alterar-senha.component.scss']
})
export class UsuarioAlterarSenhaComponent extends BaseFormComponent implements OnInit {
  
  usuario : Usuario ;
  formulario:UntypedFormGroup;
  hide = true;
  hideRepetir = true;

  inscricao$ : Subscription;
  inscricaoAuthService: Subscription;
  
  constructor(private route: ActivatedRoute,
              private formBuilder: UntypedFormBuilder,
              private serviceAlert: AlertService,
              private authService: AuthService,
              private usuarioService:UsuarioService,
              private router: Router,) { super(); }
  
  ngOnInit(): void {
    this.usuario = this.route.snapshot.data['usuario'];
    this.criacaoFormulario();
  }
  ngOnDestroy():void{
    if (this.inscricao$){
      this.inscricao$.unsubscribe();
    }
    if (this.inscricaoAuthService){
      this.inscricaoAuthService.unsubscribe();
    }
  }
  criacaoFormulario(){
    
    //formulario cliente
    this.formulario = this.formBuilder.group({
      novaSenha: [null, Validators.required],
      repetirSenha: [null, Validators.required]
    });
  }
   
  submit() {
    if (this.formulario.get('novaSenha').value !== this.formulario.get('repetirSenha').value){
      this.handleError('As senhas digitadas são diferentes!');
      return false;
    }else{
      if (!this.usuarioService.verificarSenhaForte(this.formulario.get('novaSenha').value)){
        this.handleError('Senha informada não está no padrão seguro!');
      }else{
        let codigo = this.authService.usuarioLogado.codigo;
        let senha = this.formulario.get('novaSenha').value;

        this.inscricao$ = this.usuarioService.alterarSenha(codigo,senha).subscribe(result=>{
          if (result){
            this.handlerSucesso('Senha alterada com sucesso!');
            setTimeout(() => {
              this.router.navigate(['/home']);
            }, 3000);            
          }else{
            this.handleError('Não foi alterado a senha!');
          }
        },error=>{
          console.log(error);
          this.handleError('Ocorreu erro ao tentar salvar a alteração de senha.');
        });
      }      
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
