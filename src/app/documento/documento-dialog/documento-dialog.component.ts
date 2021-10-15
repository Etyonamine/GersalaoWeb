import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { TipoDocumento } from 'src/app/tipo-documento/tipo-documento';
import { TipoDocumentoService } from 'src/app/tipo-documento/tipo-documento.service';
import { DocumentoDialog } from './documento-dialog';

@Component({
  selector: 'app-documento-dialog',
  templateUrl: './documento-dialog.component.html',
  styleUrls: ['./documento-dialog.component.scss']
})
export class DocumentoDialogComponent implements OnInit {
  tipos: TipoDocumento[];
  inscricaoTipoDocumento$: Subscription;
  descricao: string;
  codigoTipo: number;
  titulo: string;
  
  constructor(
    private serviceAlert:AlertService, 
    private tipoDocumentoService: TipoDocumentoService,
    @Inject(MAT_DIALOG_DATA) public data: DocumentoDialog
  ) { }
  ngOnInit(): void {
     this.tipos = this.data.tiposDocumento;
     this.titulo = this.data.codigoDocumento === 0 ?'Editar': 'Novo';

  }
  ngOnDestroy(): void {
    if (this.inscricaoTipoDocumento$){
      this.inscricaoTipoDocumento$.unsubscribe();
    }
  }   
  submit(){

  }  
  handleError(msg: string) {
    this.serviceAlert.mensagemErro(msg);
  }
  handlerSuccess(msg: string) {
    this.serviceAlert.mensagemSucesso(msg);
  }  
}
