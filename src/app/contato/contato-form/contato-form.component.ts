import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { EMPTY, of, Subscription } from 'rxjs';

import { DialogData } from 'src/app/endereco/endereco.component';
import { ProfissionalContato } from 'src/app/profissional/profissional-contato/profissional-contato';
import { ProfissionalContatoService } from 'src/app/profissional/profissional-contato/profissional-contato.service';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { TipoContato } from 'src/app/tipo-contato/tipo-contato';
import { TipoContatoService } from 'src/app/tipo-contato/tipo-contato.service';
import { Contato } from '../contato';
import { ContatoDialogComponent } from '../contato-dialog/contato-dialog.component';

@Component({
  selector: 'app-contato-form',
  templateUrl: './contato-form.component.html',
  styleUrls: ['./contato-form.component.scss']
})
export class ContatoFormComponent implements OnInit, OnDestroy {

  profissionalContatos: ProfissionalContato[];

  public colunas: string[] = ["tipo", "descricao",  "acao"];
  tipoContatos: TipoContato[];

  inscricaoTipoContato$: Subscription;
  inscricaoProfissionalContato$: Subscription;

  constructor(
    private alertService: AlertService,
    public dialogRef: MatDialogRef<ContatoFormComponent>,
    private serviceAlert: AlertService,
    private profissionalContatoService: ProfissionalContatoService,
    private tipoContatoService: TipoContatoService,
    public dialog: MatDialog ,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit(): void {
    this.listaTipoContato();
    this.loadData();
  }

  ngOnDestroy(): void {

    if (this.inscricaoProfissionalContato$) {
      this.inscricaoProfissionalContato$.unsubscribe();
    }

    if (this.inscricaoTipoContato$) {
      this.inscricaoTipoContato$.unsubscribe();
    }
  }
  loadData(query: string = null) {
    //profissional
    if (this.data.origemChamada == 2)
    {
       this.inscricaoProfissionalContato$ =  this.profissionalContatoService.get<ProfissionalContato[]>(this.data.codigo
      ).subscribe(result=>{
                            this.profissionalContatos = result;

      }, error=>
      {
        console.error(error);
        this.handleError('')
        {
          return EMPTY;
        };

      });
    }
  }

  openDialogNovo(){
   
    var profissionalContatoAdd = <ProfissionalContato>{
                                                            codigoProfissional: this.data.codigo,
                                                            codigoContato : 0,
                                                            contato : <Contato>{
                                                                                codigo:0,
                                                                                descricao: null,
                                                                                tipoContato : null,
                                                                                codigoUsuarioCadastrado : this.data.codigoUsuario,
                                                                                codigosituacao : 1},
                                                            codigoUsuarioCadastro :this.data.codigoUsuario};

    const dialogRef = this.dialog.open(ContatoDialogComponent,
      {width: '790px' ,height: '600px;',
        data : {
                 operacao: "Adicionar",
                 codigoUsuario: this.data.codigoUsuario,
                 profissionalContato:profissionalContatoAdd,
                 tiposContato: this.tipoContatos
                }
      }
    );
  }
  openDialogEditar(profissionalContatoParam:ProfissionalContato){
    const dialogRef = this.dialog.open(ContatoDialogComponent,
      {width: '790px' ,height: '600px;',
        data : {
                 operacao: "Editar",
                 codigoUsuario: this.data.codigoUsuario,
                 profissionalContato:profissionalContatoParam
                }
      }
    );
  }
  openDialogApagar(){

  }

  apagar() {


  }

  listaTipoContato() {
    this.inscricaoTipoContato$ = this.tipoContatoService.list<TipoContato[]>()
      .subscribe(result => {
        this.tipoContatos = result;
      },
        error => {
          console.log(error);
          this.handleError('Ocorreu um erro ao tentar recuperar a lista de tipos de contato');
        });
  }

  //validar numero
  validaNumero(contato: Contato) {
    var reg = /^-?(0|[0-9]\d*)?$/;//somente numeros
    return reg.test(contato.descricao);
  }

  validaQtdeCaracteres(valor: string, qtde: number) {

    if (valor.length < qtde) {
      return false;
    } else {
      return true;
    }

  }

  validaEmail(email: string) {
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
