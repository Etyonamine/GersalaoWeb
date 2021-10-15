import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EMPTY, Subscription } from 'rxjs';
import { ProfissionalDocumento } from 'src/app/profissional/profissional-documento/profissional-documento';
import { ProfissionalDocumentoService } from 'src/app/profissional/profissional-documento/profissional-documento.service';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { TipoDocumento } from 'src/app/tipo-documento/tipo-documento';
import { TipoDocumentoService } from 'src/app/tipo-documento/tipo-documento.service';
import { DocumentoDialogComponent } from '../documento-dialog/documento-dialog.component';

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
export class DocumentoFormComponent implements OnInit {
  colunas: string[] = ['tipo', 'descricao',  'acao'];
  codigoDocumento : number;
  habilitaNovo: boolean;
  profissionalDocumentos: ProfissionalDocumento[];  
  tiposDocumento: TipoDocumento[]; 
  inscricaoProfissionalDocumento$: Subscription;
  inscricaoTiposDocumento$: Subscription;

  constructor(
    private profissionalDocumentoService: ProfissionalDocumentoService,
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
    if (this.inscricaoProfissionalDocumento$){
      this.inscricaoProfissionalDocumento$.unsubscribe();
    }
    if (this.inscricaoTiposDocumento$){
      this.inscricaoTiposDocumento$.unsubscribe();
    }
  }
  loadData(query: string = null) {
    this.habilitaNovo = false;
    // profissional
    if (this.data.origemChamada === 2) {
      this.inscricaoProfissionalDocumento$ = this.profissionalDocumentoService.get<ProfissionalDocumento[]>(this.data.codigoProfissional)
                                                                              .subscribe(result => {
                                                                                    this.profissionalDocumentos = result;
                                                                                    if (result) {
                                                                                      this.habilitaNovo = result.length === 4 ? false : true;
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
  openDialogNovo() {
     // montando o dialogo
     const dialogRef = this.dialog.open(DocumentoDialogComponent,
      {width: '790px' , height: '600px;',
        data : {                 
                 codigoProfissional : this.data.codigoProfissional,
                 codigoDocumento : this.codigoDocumento,
                 codigoUsuario : this.data.codigoUsuario,                 
                 tiposDocumento : this.tiposDocumento
                }
      }
    );
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
  listarTiposDocumentos(){
    this.inscricaoTiposDocumento$ = this.tipoDocumentoService.list<TipoDocumento[]>()
                                        .subscribe(result => {
                                          this.tiposDocumento  = result;
                                        },
                                        error => {
                                          console.log (error);
                                          this.handleError('Ocorreu um erro em recuperar os tipos de documentos.');
                                        });
  }
}
