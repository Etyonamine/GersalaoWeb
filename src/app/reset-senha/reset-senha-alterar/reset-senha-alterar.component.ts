import { Component, OnInit } from '@angular/core';
import { MAT_MENU_SCROLL_STRATEGY } from '@angular/material/menu';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { resourceUsage } from 'process';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { ResetSenha } from '../reset-senha';
import { ResetSenhaService } from '../reset-senha.service';


@Component({
  selector: 'app-reset-senha-alterar',
  templateUrl: './reset-senha-alterar.component.html',
  styleUrls: ['./reset-senha-alterar.component.scss']
})
export class ResetSenhaAlterarComponent implements OnInit {

  resetSenha:ResetSenha;
  param1:string;
  inscricao$:Subscription;

  constructor(private route: ActivatedRoute,
              private resetSenhaService: ResetSenhaService,
              private router:Router,
              private alertService: AlertService
              ) {}    

  ngOnInit(): void {    
    let senhaReset = this.route.snapshot.data['idGuidEncontrado']
    this.param1  = senhaReset;
    this.recuperarDadosId();
    
  }
  recuperarDadosId(){

    let idGuidCripto = btoa(this.param1);

    this.inscricao$ = this.resetSenhaService.recuperarResetSenha(idGuidCripto).subscribe(result=>{
       
        if (result.expirado){
          this.handlerError ("O token está expirado! Solicite uma nova alteração de senha.")
          this.router.navigate(['/reset-senha']);
        }   
        this.resetSenha = result;     
    });
  }   
  handlerError(mensagem:string){
    return this.alertService.mensagemErro(mensagem);
  }
}
