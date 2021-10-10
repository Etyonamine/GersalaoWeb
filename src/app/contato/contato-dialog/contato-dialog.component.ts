import { ProfissionalContato } from './../../profissional/profissional-contato/profissional-contato';
import { ProfissionalContatoService } from 'src/app/profissional/profissional-contato/profissional-contato.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { ValidaEmailService } from 'src/app/shared/service/valida-email.service';
import { ValidaNumeroService } from 'src/app/shared/service/valida-numero.service';
import { ContatoService } from '../contato.service';
import { ContatoDialog } from './contato-dialog';
import { TipoContato } from 'src/app/tipo-contato/tipo-contato';

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
  codigoTipo:number;
  codigoProfissional:number;
  codigoUsuario : number;

  tipos : TipoContato[];

  inscricaoProfissionalContato$:Subscription;
  inscricaoContato$:Subscription;

  constructor(
    private contatoService : ContatoService,
    private serviceAlert : AlertService,
    private emailService: ValidaEmailService,
    private numeroService: ValidaNumeroService,
    private profissionalContatoService: ProfissionalContatoService,
    @Inject(MAT_DIALOG_DATA) public data: ContatoDialog) { }

  ngOnInit(): void {

    this.codigoUsuario = this.data.codigoUsuario;
    this.descricao = this.data.profissionalContato.contato.descricao;
    if (this.data.operacao.toLowerCase()=="editar"){
      this.tipoContato = this.data.profissionalContato.contato.tipoContato.descricao;
    }else
    {
      this.tipoContato ='';
    }

    this.titulo  = this.data.operacao;
    this.codigo = this.data.profissionalContato.codigoContato;
    this.codigoProfissional = this.data.profissionalContato.codigoProfissional;
    this.tipos = this.data.tiposContato;
    this.codigoTipo=0;

  }

  ngOnDestroy():void{
    if (this.inscricaoProfissionalContato$){
      this.inscricaoProfissionalContato$.unsubscribe();
    }
    if (this.inscricaoContato$){
      this.inscricaoContato$.unsubscribe();
    }
  }

  validarCampos(){
    if(this.codigoTipo==0 && this.data.operacao.toLowerCase()!=="editar"){
      this.handleError("Por favor selecione um tipo.");
      return false;

    }

    if (this.descricao == undefined || this.descricao == null || this.descricao.trim()==''){
      this.handleError('Descricao/Valor não preenchido.');
      return false;
    }

    switch(this.codigoTipo){
      case 1: //telefone fixo
        if (this.numeroService.somenteNumero(this.descricao.trim())== false){
          this.handleError('Por favor, informe somente números.');
          return false;
        }

        //validar quantidade de caracteres maximo e minimo
        if (this.numeroService.quantidadeCaracteresValido(10, this.descricao)== false){
          this.handleError('Por favor, verifique e informe os 10 números(DDD + telefone-fixo Exemplo: 1122223333).');
          return false;
        }
        break;
      case 2: //celular
        if (this.numeroService.somenteNumero(this.descricao.trim())== false){
          this.handleError('Por favor, informe somente números.');
          return false;
        }

        //validar quantidade de caracteres maximo e minimo
        if (this.numeroService.quantidadeCaracteresValido(11, this.descricao)== false){
          this.handleError('Por favor, verifique e informe os 11 números(DDD + telefone-fixo Exemplo: 11922223333).');
          return false;
        }
        break;
      default: //e-mail
      if(this.emailService.validateEmail(this.descricao) == false)
      {
        this.handleError('E-mail informado é inválido.');
        return false;
      }
      break;
    }
    return true;
  }
  submit(){

    if(this.validarCampos()==false){
      return false;
    }
    //gravando os dados.
    var contatoGravar = this.data.profissionalContato.contato;
    contatoGravar.codigoTipoContato=this.codigoTipo;
    contatoGravar.descricao = this.descricao.trim();
    contatoGravar.codigosituacao=1;
    if(this.codigo=0){
      contatoGravar.codigoUsuarioCadastrado=this.codigoUsuario;
      contatoGravar.dataCadastro = new Date();
    }else{
      contatoGravar.codigoUsuarioAlteracao = this.codigoUsuario;
      contatoGravar.dataAlteracao = new Date();
    }

    this.contatoService.save(contatoGravar)
                        .subscribe(result=>{
                          if (result!== null){
                            //this.handlerSuccess('registro salvado com sucesso!');
                            this.data.profissionalContato.codigoContato=result.codigo;
                            this.codigo = result.codigo;

                          }
                        },
                        error=>{
                          console.log(error);
                          this.handleError('Ocorreu um erro na tentativa de salvar o registro.');
                          return false;
                        });

    //gravar no profossionalcontato
    if (this.data.operacao.toLowerCase() !== "editar"){

        this.profissionalContatoService.save(this.data.profissionalContato)
                                      .subscribe(result=>{

                                      }, error=>{
                                        this.contatoService.delete( this.codigo).subscribe();
                                        console.log(error);
                                        this.handleError('Ocorreu um erro na tentativa de salvar o registro.');
                                        return false;

                                       } );
    }
    this.handlerSuccess('registro salvo com sucesso!');
  }

  handleError(msg: string) {
    this.serviceAlert.mensagemErro(msg);
  }


  handlerSuccess(msg: string) {
    this.serviceAlert.mensagemSucesso(msg);
  }

}
