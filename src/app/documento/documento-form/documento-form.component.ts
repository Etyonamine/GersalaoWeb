import { DocumentoService } from './../documento.service';
import { Documento } from './../documento';
import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EMPTY, Subscription } from 'rxjs';
import { ProfissionalDocumento } from 'src/app/profissional/profissional-documento/profissional-documento';
import { ProfissionalDocumentoService } from 'src/app/profissional/profissional-documento/profissional-documento.service';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { TipoDocumento } from 'src/app/tipo-documento/tipo-documento';
import { TipoDocumentoService } from 'src/app/tipo-documento/tipo-documento.service';
import { DocumentoDialogComponent } from '../documento-dialog/documento-dialog.component';
import { DocumentoDialog } from '../documento-dialog/documento-dialog';

export interface DialogDataDocumento {
  origemChamada: number;
  codigoProfissional: number;
  codigoUsuario: number;
}

@Component({
  selector: 'app-documento-form',
  templateUrl: './documento-form.component.html',
  styleUrls: ['./documento-form.component.scss']
})
export class DocumentoFormComponent implements OnInit, OnDestroy {
  colunas: string[] = ['tipo', 'descricao',  'acao'];
  codigoDocumento: number;
  habilitaNovo: boolean;
  profissionalDocumentos: ProfissionalDocumento[];
  tiposDocumento: TipoDocumento[];
  inscricaoProfissionalDocumento$: Subscription;
  inscricaoTiposDocumento$: Subscription;
  inscricaoDocumento$: Subscription;

  constructor(
    private profissionalDocumentoService: ProfissionalDocumentoService,
    private documentoService: DocumentoService,
    private tipoDocumentoService: TipoDocumentoService,
    private serviceAlert: AlertService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: DialogDataDocumento
  ) { }
  ngOnInit(): void {
    this.loadData();
    this.listarTiposDocumentos();
  }
  ngOnDestroy(): void {
    if (this.inscricaoProfissionalDocumento$) {
      this.inscricaoProfissionalDocumento$.unsubscribe();
    }
    if (this.inscricaoTiposDocumento$) {
      this.inscricaoTiposDocumento$.unsubscribe();
    }
    if (this.inscricaoDocumento$) {
      this.inscricaoDocumento$.unsubscribe();
    }
  }
  loadData(query: string = null) {
    this.habilitaNovo = false;
    // profissional
    if (this.data.origemChamada === 2) {
       this.profissionalDocumentoService.get<ProfissionalDocumento[]>(this.data.codigoProfissional)
                                        .subscribe(result => {
                                          if (result) {
                                            this.habilitaNovo = result.length === 4 ? false : true;
                                            // recuperando o documento e tipo
                                            result.forEach(item => {
                                              this.inscricaoDocumento$ =
                                                this.documentoService.get<Documento> (item.CodigoDocumento).subscribe(documentoEnc => {
                                                item.Documento = documentoEnc;
                                              });
                                            });
                                          }
                                          this.profissionalDocumentos = result;
                                        }, error => {
                                          console.error(error);
                                          this.handleError('Ocorreu erro na tentativa de recuperar a lista de documentos do profissional.');
                                          {
                                            return EMPTY;
                                          }
                                        });
    }
  }
  openDialogNovo() {
    // verificar quais os tipos que podem ser enviados para o dialogo
    const tiposDialog = this.tiposDialog();
    // dados do documento
    const documentoDialog = {
      codigo : 0,
      descricao : '',
      codigoSituacao : 1,
      codigoUsuarioCadastro : this.data.codigoUsuario,
      codigoTipoDocumento : 0
    } as Documento;

     // montando o dialogo
    const dialog = this.dialog.open(DocumentoDialogComponent, {
                                      width: '790px' , height: '600px;',
                                        data : {
                                                codigoProfissional : this.data.codigoProfissional,
                                                tiposDocumento : tiposDialog,
                                                documento : documentoDialog
                                                }
                                              });
  }
  openDialogEditar(profissionalDocumento: ProfissionalDocumento) {

  }
  openDialogApagar(codigoDocumento: number) {

  }
  handleError(msg: string) {
    this.serviceAlert.mensagemErro(msg);
  }
  handlerSuccess(msg: string) {
    this.serviceAlert.mensagemSucesso(msg);
  }
  listarTiposDocumentos() {
    this.inscricaoTiposDocumento$ = this.tipoDocumentoService.list<TipoDocumento[]>()
                                        .subscribe(result => {
                                          this.tiposDocumento  = result;
                                        },
                                        error => {
                                          console.log (error);
                                          this.handleError('Ocorreu um erro em recuperar os tipos de documentos.');
                                        });
  }
  tiposDialog() {
    const tipoAux = this.tiposDocumento;
    // filtrando o tipo que ainda nao foi cadastrado.
    if (this.profissionalDocumentos.length > 0 ) {

     this.profissionalDocumentos.forEach(item => {
       tipoAux.forEach( (tipo , index) => {
          if (item.Documento.codigoTipoDocumento === tipo.codigo) {
           tipoAux.splice(index, 1);
         }
       });
     });
   }
    return tipoAux;
 }
}
