import { TipoContato } from './../../tipo-contato/tipo-contato';
import { ContatoService } from './../contato.service';
import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { concat, EMPTY, of, Subscription } from 'rxjs';
import { concatMap } from 'rxjs/operators';

import { DialogData } from 'src/app/endereco/endereco.component';
import { ProfissionalContato } from 'src/app/profissional/profissional-contato/profissional-contato';
import { ProfissionalContatoService } from 'src/app/profissional/profissional-contato/profissional-contato.service';
import { AlertService } from 'src/app/shared/alert/alert.service';
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

  public colunas: string[] = ['tipo', 'descricao',  'acao'];
  tipoContatos: TipoContato[];
  habilitaNovo: boolean;
  inscricaoTipoContato$: Subscription;
  inscricaoProfissionalContato$: Subscription;

  constructor(
    private alertService: AlertService,
    public dialogRef: MatDialogRef<ContatoFormComponent>,
    private serviceAlert: AlertService,
    private contatoService: ContatoService,
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
    this.habilitaNovo = false;
    // profissional
    if (this.data.origemChamada === 2) {
       this.inscricaoProfissionalContato$ =  this.profissionalContatoService.get<ProfissionalContato[]>(this.data.codigo
      ).subscribe(result => {
                            this.profissionalContatos = result;
                            if (result) {
                              this.habilitaNovo = result.length === 3 ? false : true;
                            }
      }, error => {
        console.error(error);
        this.handleError('');
        {
          return EMPTY;
        }

      });
    }
  }
  tiposDialog(){
     const tipoAux = this.tipoContatos;
     // filtrando o tipo que ainda nao foi cadastrado.
     if (this.profissionalContatos.length > 0 ) {

      this.profissionalContatos.forEach(item => {
        tipoAux.forEach( (tipo , index) => {
          if (item.contato.tipoContato.codigo === tipo.codigo) {
            tipoAux.splice(index, 1);
          }
        });
      });
    }

     return tipoAux;
  }
  openDialogNovo() {

    // filtrando o tipo que ainda nao foi cadastrado.
    const tiposDialogNovo = this.tiposDialog();
    // montando os dados de profissional contato
    const profissionalContatoAdd = {
                                                            codigoProfissional: this.data.codigo,
                                                            codigoContato : 0,
                                                            contato : {
                                                                                codigo: 0,
                                                                                descricao: null,
                                                                                tipoContato : null,
                                                                                codigoUsuarioCadastrado : this.data.codigoUsuario,
                                                                                codigosituacao : 1} as Contato,
                                                            codigoUsuarioCadastro : this.data.codigoUsuario} as ProfissionalContato;
    // montando o dialogo
    const dialogRef = this.dialog.open(ContatoDialogComponent,
      {width: '790px' , height: '600px;',
        data : {
                 operacao: 'Adicionar',
                 codigoUsuario: this.data.codigoUsuario,
                 profissionalContato: profissionalContatoAdd,
                 tiposContato: tiposDialogNovo
                }
      }
    );

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      this.loadData();
    });
  }
  openDialogEditar(profissionalContatoParam: ProfissionalContato): void {
    // tipo de contato especifico
    const tipoContatoEditar = {
      codigo : profissionalContatoParam.contato.tipoContato.codigo,
      descricao : profissionalContatoParam.contato.tipoContato.descricao
    } as TipoContato;
    const tipos: Array<TipoContato>  = [];
    tipos.push(tipoContatoEditar);
    const dialogRef = this.dialog.open(ContatoDialogComponent,
      {width: '790px' , height: '600px;',
        data : {
                 operacao: 'Editar',
                 codigoUsuario: this.data.codigoUsuario,
                 profissionalContato: profissionalContatoParam,
                 tiposContato : tipos
                }
      }
    );
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      this.loadData();
    });
  }
  openDialogApagar(codigoContato: number) {
    this.alertService.openConfirmModal('Tem certeza que deseja excluir?', 'Excluir - Contato', (resposta: boolean) => {
      if (resposta) {
        this.apagar(codigoContato);
        // this.exclusaoCliente(codigo);
      }
    }, 'Sim', 'Não'
    );
  }
  apagar(codigoExcluir: number) {

     const profissionalContatoExcluir = {
      codigoContato : codigoExcluir,
      codigoProfissional : this.data.codigo
    } as ProfissionalContato;
     this.profissionalContatoService.Excluir(profissionalContatoExcluir)
                                    .pipe(concatMap(result => {
                                       // excluir o contato
                                       this.contatoService.delete(codigoExcluir)
                                                          .subscribe(exclusao => {
                                                            return of (true);
                                                          },
                                                          error => {
                                                            console.log(error);
                                                            this.handleError('Ocorreu erro ao apagar o contato.');
                                                          });

                                       return of (true);
                                    })).subscribe(result => {
                                      if (result) {
                                        this.handlerSuccess('Registro apagado com sucesso!');
                                        this.loadData();
                                      }
                                    },
                                    error => {
                                      console.log(error);
                                        });
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
  // validar numero
  validaNumero(contato: Contato) {
    const reg = /^-?(0|[0-9]\d*)?$/; // somente numeros
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
    // tslint:disable-next-line: max-line-length
    const regularExpression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regularExpression.test(String(email).toLowerCase());
  }
  openConfirmExclusao(codigoContato: number) {
    const mensagem = `Tem certeza que deseja excluir o contato ?`;

    this.alertService.openConfirmModal(mensagem, 'Excluir - Contato', (answer: boolean) => {
      if (answer) {

        this.apagar(codigoContato);
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
