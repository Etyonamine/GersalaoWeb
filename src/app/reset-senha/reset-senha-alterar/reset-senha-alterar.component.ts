import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_MENU_SCROLL_STRATEGY } from '@angular/material/menu';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { resourceUsage } from 'process';
import { Subscription } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { BaseFormComponent } from 'src/app/shared/base-form/base-form.component';
import { UsuarioService } from 'src/app/usuario/usuario.service';
import { ResetSenha } from '../reset-senha';
import { ResetSenhaService } from '../reset-senha.service';


@Component({
  selector: 'app-reset-senha-alterar',
  templateUrl: './reset-senha-alterar.component.html',
  styleUrls: ['./reset-senha-alterar.component.scss']
})
export class ResetSenhaAlterarComponent extends BaseFormComponent implements OnInit,OnDestroy {
  

  resetSenha:ResetSenha;
  param1:string;
  inscricao$:Subscription;
  inscricaoReset$:Subscription;

  formulario:FormGroup;
  hide = true;
  hideRepetir = true;

  
  inscricaoAuthService: Subscription;

  constructor(private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private usuarioService:UsuarioService,
              private resetSenhaService: ResetSenhaService,
              private router:Router,
              private alertService: AlertService
              ) {super();}    

  ngOnInit(): void {    
    let senhaReset = this.route.snapshot.data['idGuidEncontrado']
    this.param1  = senhaReset;
    this.recuperarDadosId();
    this.criacaoFormulario();
  }
  ngOnDestroy():void{
    if (this.inscricao$){
      this.inscricao$.unsubscribe();
    }
    if (this.inscricaoAuthService){
      this.inscricaoAuthService.unsubscribe();
    }
    if (this.inscricaoReset$){
      this.inscricaoReset$.unsubscribe();
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
        let codigo = this.resetSenha.codigoUsuario.toString();
        let senha = this.formulario.get('novaSenha').value;

        this.inscricao$ = this.usuarioService.alterarSenhaReset(this.param1,senha)
        .subscribe(result=>{
          if (result){
            this.atualizarSituacaoReset();
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
  atualizarSituacaoReset(){
    this.inscricaoReset$ = this.resetSenhaService.atualizarSituacaoParaExecutado(this.resetSenha.idGuid).subscribe(result=>{},error=>{
      console.log(error);
      this.handleError("Ocorre um erro ao tentar atualizar o status do reset.");
    }

    );
  }
  recuperarDadosId(){

    let idGuidCripto = btoa(this.param1);

    this.inscricao$ = this.resetSenhaService.recuperarResetSenha(idGuidCripto).subscribe(result=>{
       
        if (result.expirado){
          this.handleError ("O token está expirado! Solicite uma nova alteração de senha.")
          this.router.navigate(['/reset-senha']);
        }else if(result.situacao === 11){
          this.handleError ("Reset já foi executado! Solicite uma nova alteração de senha.")
          this.router.navigate(['/reset-senha']);
        }
        this.resetSenha = result;     
    });
  }   
  handlerSucesso(mensagem:string){
    return this.alertService.mensagemSucesso(mensagem);
  }
  handleError(mensagem:string){
    return this.alertService.mensagemErro(mensagem);
  }
}
