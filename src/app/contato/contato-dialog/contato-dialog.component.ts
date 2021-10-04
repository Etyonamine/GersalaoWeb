import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ProfissionalContatoService } from 'src/app/profissional/profissional-contato/profissional-contato.service';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { ValidaEmailService } from 'src/app/shared/service/valida-email.service';
import { ValidaNumeroService } from 'src/app/shared/service/valida-numero.service';
import { ContatoService } from '../contato.service';
import { ContatoDialog } from './contato-dialog';
import { Contato } from '../contato';

@Component({
  selector: 'app-contato-dialog',
  templateUrl: './contato-dialog.component.html',
  styleUrls: ['./contato-dialog.component.scss']
})
export class ContatoDialogComponent implements OnInit {
   

  titulo:string;
  tipoContato:string;
  descricao : string;
  codigo:number;
  codigoProfissional:number;
  codigoUsuario : number;

  inscricaoProfissionalContato$:Subscription;
  inscricaoContato$:Subscription;

  constructor(
    private contatoService : ContatoService,
    private serviceAlert : AlertService,
    private emailService: ValidaEmailService,   
    private numeroService: ValidaNumeroService,
    @Inject(MAT_DIALOG_DATA) public data: ContatoDialog) { }

  ngOnInit(): void {
    
    this.codigoUsuario = this.data.codigoUsuario;
    this.descricao = this.data.profissionalContato.contato.descricao;
    this.tipoContato = this.data.profissionalContato.contato.tipoContato.descricao;
    this.codigo = this.data.profissionalContato.codigoContato;
    this.codigoProfissional = this.data.profissionalContato.codigoProfissional;
     
  }

  ngOnDestroy():void{
    if (this.inscricaoProfissionalContato$){
      this.inscricaoProfissionalContato$.unsubscribe();
    }
    if (this.inscricaoContato$){
      this.inscricaoContato$.unsubscribe();
    }
  }

  submit(){
    if (this.descricao == undefined || this.descricao == null || this.descricao.trim()==''){
      this.handleError('Descricao/Valor não preenchido.');
      return false;
    }
    //validar e-mail
    if (this.tipoContato.toLowerCase() == "e-mail"){
      if(this.emailService.validateEmail(this.descricao) == false) 
      {
        this.handleError('E-mail informado é inválido.');
        return false;
      }
    }

    // se for telefone
    if (this.tipoContato.toLowerCase() =="telefone-fixo"){

      if (this.numeroService.somenteNumero(this.descricao.trim())== false){
        this.handleError('Por favor, informe somente números.');
        return false;
      }

      //validar quantidade de caracteres maximo e minimo
      if (this.numeroService.quantidadeCaracteresValido(10, this.descricao)== false){
        this.handleError('Por favor, verifique e informe os 10 números(DDD + telefone-fixo Exemplo: 1122223333).');
        return false;
      }
      
    }

    // se for celular
    if (this.tipoContato.toLowerCase() =="celular"){

      if (this.numeroService.somenteNumero(this.descricao.trim())== false){
        this.handleError('Por favor, informe somente números.');
        return false;
      }

      //validar quantidade de caracteres maximo e minimo
      if (this.numeroService.quantidadeCaracteresValido(11, this.descricao)== false){
        this.handleError('Por favor, verifique e informe os 11 números(DDD + telefone-fixo Exemplo: 11922223333).');
        return false;
      }
       
    }
    //gravando os dados.
    if (this.data.operacao.toLowerCase() == "editar"){
      var contatoGravar = this.data.profissionalContato.contato;

      contatoGravar.descricao = this.descricao.trim();
      contatoGravar.codigoUsuarioAlteracao = this.codigoUsuario;
      contatoGravar.dataAlteracao = new Date();
      
      this.inscricaoContato$ = this.contatoService.save(contatoGravar)
                                                  .subscribe(result=>{
                                                    if (result!== null){
                                                      this.handlerSuccess('registro salvado com sucesso!');
                                                    }
                                                  },
                                                  error=>{
                                                    console.log(error);
                                                    this.handleError('Ocorreu um erro na tentativa de salvar o registro.');
                                                  });
    }else{
      
    }
  } 
  
  handleError(msg: string) {
    this.serviceAlert.mensagemErro(msg);
  }


  handlerSuccess(msg: string) {
    this.serviceAlert.mensagemSucesso(msg);
  } 

}
