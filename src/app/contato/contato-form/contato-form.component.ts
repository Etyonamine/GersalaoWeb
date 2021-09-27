import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { of, Subscription } from 'rxjs';
import { concatMap } from 'rxjs/operators';
 
import { DialogData } from 'src/app/endereco/endereco.component';
import { ProfissionalContato } from 'src/app/profissional/profissional-contato/profissional-contato';
import { ProfissionalContatoService } from 'src/app/profissional/profissional-contato/profissional-contato.service';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { Contato } from '../contato';
import { ContatoService } from '../contato.service';
 
@Component({
  selector: 'app-contato-form',
  templateUrl: './contato-form.component.html',
  styleUrls: ['./contato-form.component.scss']
})
export class ContatoFormComponent implements OnInit, OnDestroy {

  codigoContato:number;
  telefoneFixo : Contato ;
  telefoneCelular:Contato;
  email : Contato;

  blnApagar:boolean;
  
  numeroTelefoneFixoValido: boolean;
  numeroTelefoneCelularValido: boolean;
  qtdeDigitosTelefoneFixo: boolean;
  qtdeDigitosTelefoneCel: boolean;
  emailValido : boolean;

  telefoneFixoPreenchido: boolean;
  telefoneCelularPreenchido: boolean;
  emailPreenchido: boolean;

  profissionalContatos : Array<ProfissionalContato>=[];


  inscricaoContato$ : Subscription;
  inscricaoProfissionalContato$: Subscription;

  constructor(
                private alertService:AlertService,
                public dialogRef: MatDialogRef<ContatoFormComponent>,
                private serviceAlert:AlertService,
                private contatoService: ContatoService,
                private profissionalContatoService : ProfissionalContatoService,
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
    this.telefoneFixoPreenchido = false;
    this.telefoneCelularPreenchido = false;
    this.emailPreenchido = false;
    this.consultarDados();

  }
  
  ngOnDestroy():void{
    if (this.inscricaoContato$){
      this.inscricaoContato$.unsubscribe();
    }
    if (this.inscricaoProfissionalContato$){
      this.inscricaoProfissionalContato$.unsubscribe();
    }
  }


  submit(){

    //validar se está preenchido.
    this.telefoneFixoPreenchido = (this.telefoneFixo.descricao == undefined || this.telefoneFixo.descricao == '')?false:true;
    this.telefoneCelularPreenchido = (this.telefoneCelular.descricao == undefined || this.telefoneCelular.descricao == '')?false:true;
    this.emailPreenchido = (this.email.descricao == undefined || this.email.descricao == '')?false:true;


    //telefone fixo     
      this.numeroTelefoneFixoValido = (this.telefoneFixoPreenchido) ?(this.validaNumero(this.telefoneFixo)):false;
      this.qtdeDigitosTelefoneFixo = (this.telefoneFixoPreenchido)?this.validaQtdeCaracteres(this.telefoneFixo.descricao,10):false;   

    //telefone celular    
      this.numeroTelefoneCelularValido = this. telefoneCelularPreenchido? this.validaNumero(this.telefoneCelular):false;
      this.qtdeDigitosTelefoneCel = this.telefoneCelularPreenchido? this.validaQtdeCaracteres(this.telefoneCelular.descricao, 11):false;
        
    //email    
    this.emailValido = this.emailPreenchido ? this.validaEmail(this.email.descricao):false;
        

    //gravando se tiver ok
    //telefone fixo
    if (this.numeroTelefoneFixoValido && this.qtdeDigitosTelefoneFixo ){
      this.gravarContato (this.telefoneFixo);      
      
    }
    if( this.numeroTelefoneCelularValido && this.qtdeDigitosTelefoneCel ){
      this.gravarContato (this.telefoneCelular);      
    }
    if (this.emailValido ){
      
      this.gravarContato(this.email);
      
    }

   

  }

  gravarContato (contato:Contato){
    var profissionalContato : ProfissionalContato;

    if (contato.codigo > 0){
      contato.dataAlteracao = new Date();
      this.contatoService.save(contato).subscribe(result=>{
        this.handlerSuccess('Contato atualizado com sucesso!');
      },
      error=>{
        console.log(error);
        this.handleError('Ocorreu um erro na tentativa de atualizar o contato.');
      });
    }else{
      contato.dataCadastro = new Date();
      contato.codigosituacao= 1;
      
      this.inscricaoContato$ = this.contatoService.save(contato)
                                                  .pipe(
                                                    concatMap((result: Contato)=>{
                                                      if (result!==null){
                                                        profissionalContato = <ProfissionalContato>{
                                                                                codigoContato : result.codigo, 
                                                                                codigoProfissional : this.data.codigo,
                                                                                codigoUsuarioCadastro : this.data.codigoUsuario,
                                                                                dataCadastro : new Date()
                                                                              };
                                                        //Gravando no profissional contato
                                                        this.inscricaoProfissionalContato$ = 
                                                                              this.profissionalContatoService.save(profissionalContato)
                                                                                                                    .subscribe(result=>{
                                                                                                                      if (result!==null){
                                                                                                                        this.handlerSuccess('Contato gravado com sucesso!');
                                                                                                                      }
                                                                                                                    });
                                                      }
                                                      return of(true); 
                                                    })
                                                    )
                                                  .subscribe(result=>{
                                                    if(result){
                                                      this.blnApagar = true;
                                                    }
                                                  },
                                                  error=>{
                                                    console.log(error);
                                                    this.handleError('Ocorreu um erro na tentativa de gravar o contato.');
                                                  }
                                                    
                                                  );
    }
    
                                                
  }
  //recuperar informações
  consultarDados (){

    this.telefoneFixoPreenchido = false;
    this.telefoneCelularPreenchido = false;
    this.emailPreenchido = false;

    //profissional
    if (this.data.origemChamada == 2){
      this.blnApagar = false;

      this.telefoneFixo = <Contato>{
                                    codigoTipoContato : 1 ,
                                    codigosituacao : 1 
                                  };
      this.telefoneCelular = <Contato>{
                                        codigoTipoContato : 2 ,
                                        codigosituacao : 1 
                                      };
      this.email = <Contato>{
                              codigoTipoContato : 3 ,
                              codigosituacao : 1 
                            };

      this.inscricaoProfissionalContato$ = this.profissionalContatoService.get<ProfissionalContato[]>(this.data.codigo)
      .subscribe(result=>{
        if (result!= null){    
          this.profissionalContatos = result;
          for (let i=0; i < result.length;i++){
              //atribuindo as contatos 
              switch(result[i].contato.codigoTipoContato){
                case 1: //telefone fixo;
                  this.telefoneFixo = result[i].contato;
                  this.telefoneFixoPreenchido = true;                  
                  break;
                case 2: //telefone celular;
                  this.telefoneCelular = result[i].contato;
                  this.telefoneCelularPreenchido = true;
                  break;
                default:
                  this.email = result[i].contato;
                  this.emailPreenchido = true;                
                  break;
              }   
          }
          this.blnApagar = true;
        }
      }, error=>{
        console.error(error);
      });
    }
    
  }
  apagar(){

    if(this.data.origemChamada === 2)
    {
      if (this.profissionalContatos.length>0){

        this.profissionalContatos[0].contato = null;
        this.profissionalContatos[1].contato = null;
        this.profissionalContatos[2].contato = null;

       this.inscricaoProfissionalContato$ = this.profissionalContatoService.deleteLote<ProfissionalContato[]>(this.profissionalContatos).subscribe(result=>{
         if (result){
           this.handlerSuccess('Contatos apagados com sucesso!');
         }

       }, error=>{
         console.log(error);

         this.handleError('Erro ocorrido na tentativa de apagar o contato.');
       })
      }
      
    }
  }
  
  //validar numero 
  validaNumero(contato : Contato){
    var reg = /^-?(0|[0-9]\d*)?$/;//somente numeros    
    return reg.test(contato.descricao);            
  }

  validaQtdeCaracteres(valor:string, qtde :number){
     
    if (valor.length < qtde){
      return false;
    }else{
      return true;
    }    

  }

  validaEmail (email:string){
    const regularExpression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regularExpression.test(String(email).toLowerCase());
  }

  openConfirmExclusao() {
    const mensagem = `Tem certeza que deseja excluir o contato ?`;

    this.alertService.openConfirmModal(mensagem, 'Excluir - Contato', (answer: boolean) => {
      if (answer) {

        this.apagar();
      }
    }, 'Sim', 'Não'
    );
  }

  
  handleError(msg: string) {
    this.serviceAlert.mensagemErro(msg);
  }

  
  handlerSuccess(msg: string) {
    this.serviceAlert.mensagemSucesso(msg);
  }
}
