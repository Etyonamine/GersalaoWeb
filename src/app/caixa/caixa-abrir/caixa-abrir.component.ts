import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth-guard/auth.service';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { BaseFormComponent } from 'src/app/shared/base-form/base-form.component';
import { Caixa } from '../caixa';
import { CaixaService } from '../caixa.service';

@Component({
  selector: 'app-caixa-abrir',
  templateUrl: './caixa-abrir.component.html',
  styleUrls: ['./caixa-abrir.component.scss']
})
export class CaixaAbrirComponent extends BaseFormComponent implements OnInit {
  codigoUsuario: number;
  dataCorrente: Date;
  formulario: FormGroup;
  inscricao$: Subscription;  
    
  constructor(private formBuilder: FormBuilder,
              private alertService:AlertService,
              private caixaService: CaixaService,
              private router: Router,
              private authService:AuthService ) {
    super();
  }
  ngOnInit(): void {
   this.dataCorrente = new Date();  
   this.criacaoFormulario();
   this.authService.getUserData();
   this.codigoUsuario = Number.parseInt(this.authService.usuarioLogado.codigo);
  }
  criacaoFormulario() {
    this.formulario = this.formBuilder.group({
      dataCorrente: [this.dataCorrente.toLocaleString()],
      valorInicial:[0, Validators.required],
      observacao:[null]
    });
  }   
  handleError(msg:string){
    this.alertService.mensagemErro(msg);
  }  
  handleSucesso(msg:string){
    this.alertService.mensagemSucesso(msg);
  }  
  retornar(){
    this.router.navigate(['/caixa']);
  }
  allowNumericDigitsOnlyOnKeyUp(e) {		
		const charCode = e.which ? e.which : e.keyCode;
		if (charCode !== 190 && charCode !== 46 && charCode!==44){
      if (charCode > 31  && (charCode < 48 || charCode > 57)) {
        this.handleError("Por favor, informar apenas numeros e casas decimais");        
      }
    }	 
	}
  submit() {
    let caixaGravar={
      codigo: 0,
      codigoUsuarioAbertura: this.codigoUsuario,
      dataAbertura : new Date(),
      observacao : this.formulario.get('observacao').value,
      valorInicial: this.formulario.get('valorInicial').value
    } as Caixa;


    this.alertService.openConfirmModal('Por favor, confirmar se deseja continuar a abertura de caixa?', 'Abertura - Caixa', (resposta: boolean) => {
      if (resposta) {
        this.inscricao$ = this.caixaService.save(caixaGravar)
                                           .subscribe(retorno=>{
                                            if (retorno){
                                              this.handleSucesso('Salvo com sucesso!');
                                              setTimeout(() => {
                                                this.retornar();
                                              }, 3000);
                                            }else{
                                              this.handleError('Ocorreu algum erro ao tentar abrir o caixa.');
                                            }
                                           },error=>{
                                            this.handleError('Ocorreu algum erro ao tentar abrir o caixa.');
                                            console.log(error);
                                           });       
        
      }}, 'Sim', 'Não'
      );
  }

}
