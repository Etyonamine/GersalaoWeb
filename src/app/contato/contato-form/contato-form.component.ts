import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from 'src/app/endereco/endereco.component';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { Contato } from '../contato';
 
@Component({
  selector: 'app-contato-form',
  templateUrl: './contato-form.component.html',
  styleUrls: ['./contato-form.component.scss']
})
export class ContatoFormComponent implements OnInit {
  codigoContato:number;
  telefoneFixo : Contato ;
  telefoneCelular:Contato;
  email : Contato;
  
  numeroTelefoneFixoValido: boolean;
  numeroTelefoneCelularValido: boolean;
  qtdeDigitosTelefoneFixo: boolean;
  qtdeDigitosTelefoneCel: boolean;
  emailValido : boolean;

  constructor(
                private alertService:AlertService,
                public dialogRef: MatDialogRef<ContatoFormComponent>,
                private serviceAlert:AlertService,
                @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit(): void {
    this.telefoneFixo = <Contato>{codigoTipoContato:1, descricao : ''};
    this.telefoneCelular = <Contato>{codigoTipoContato:2, descricao : null};
    this.email = <Contato>{codigoTipoContato:3, descricao : null};
    this.numeroTelefoneFixoValido = true;
    this.numeroTelefoneCelularValido = true;
    this.qtdeDigitosTelefoneFixo = true;
    this.qtdeDigitosTelefoneCel = true;
    this.emailValido = true;

  }
  
  submit(){

    //telefone fixo
    this.numeroTelefoneFixoValido = this.validaNumero(this.telefoneFixo);
    this.qtdeDigitosTelefoneFixo = this.validaQtdeCaracteres(this.telefoneFixo.descricao);

    //telefone celular

    this.numeroTelefoneCelularValido =this.telefoneCelular.descricao!== undefined && this.telefoneCelular.descricao!== null && this.telefoneCelular.descricao!==''? this.validaNumero(this.telefoneCelular):true;
    this.qtdeDigitosTelefoneCel = this.telefoneCelular.descricao!== undefined && this.telefoneCelular.descricao!==''? this.validaQtdeCaracteres(this.telefoneCelular.descricao):true;

    //email
    this.emailValido = this.email.descricao!==undefined && this.email.descricao!==null? this.validaEmail(this.email.descricao):true;
  }
  apagar(){

  }
  
  //validar numero 
  validaNumero(contato : Contato){
    var reg = /^-?(0|[0-9]\d*)?$/;//somente numeros    
    return reg.test(contato.descricao);            
  }

  validaQtdeCaracteres(valor:string){
    var reg = /^\d{10}$/;
    return reg.test(valor);

  }
  validaEmail (email:string){
    const regularExpression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regularExpression.test(String(email).toLowerCase());
  }

  openConfirmExclusao() {
    const mensagem = `Tem certeza que deseja excluir o endereco ?`;

    this.alertService.openConfirmModal(mensagem, 'Excluir - Endereco', (answer: boolean) => {
      if (answer) {

        this.apagar();
      }
    }, 'Sim', 'Não'
    );
  }

  
  handleError(msg: string) {
    this.serviceAlert.mensagemErro(msg);
  }
}
