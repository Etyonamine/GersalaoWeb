import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlertService } from '../shared/alert/alert.service';
import { BaseFormComponent } from '../shared/base-form/base-form.component';
import { ResetSenhaService } from './reset-senha.service';

@Component({
  selector: 'app-reset-senha',
  templateUrl: './reset-senha.component.html',
  styleUrls: ['./reset-senha.component.scss']
})
export class ResetSenhaComponent extends BaseFormComponent  implements OnInit, OnDestroy {
  value!: string;

  submit() {
    let email = this.formulario.get("email").value;

     
      this.inscricao$ = this.resetSenhaService.solicitarReset(email).subscribe(result=>{
        if(result){
          this.handlerSucesso("Sua solicitação foi efetuado com sucesso!");   
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000);     
        }else{
          this.handleError("Ocorreu algum problema no envio da sua solicitação.");
        }
      },error=>{
        if (error.status === "400"){
          this.handlerSucesso("Sua mensagem foi efetuado com sucesso!")
          
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000);
        }else{
          console.log(error);
          this.handleError("O serviço está fora");
         
        }      
        
      });
     
    
  }
  
  formulario:FormGroup;
  inscricao$: Subscription;

  constructor(private formBuilder: FormBuilder,
              private resetSenhaService: ResetSenhaService,
              private serviceAlert : AlertService, 
              private router: Router
              ) {
    super();
   }

  ngOnInit(): void {
    this.criarFormulario();
  }

  ngOnDestroy():void{
    if (this.inscricao$)
    {
      this.inscricao$.unsubscribe();
    }
  }

  criarFormulario(){
    //formulario cliente
    this.formulario = this.formBuilder.group({
      email: [null, [Validators.required,Validators.pattern("^[A-Za-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]]    
    });
  }
  handlerSucesso(message:string){
    this.serviceAlert.mensagemSucesso(message);
  }
  handleError(message:string)
  {
    this.serviceAlert.mensagemErro(message);
  }
  
  change(value: string) {
    this.value = value;
    
  }
}
