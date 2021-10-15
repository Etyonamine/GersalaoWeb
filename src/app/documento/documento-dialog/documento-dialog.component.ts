import { concatMap } from 'rxjs/operators';
import { ValidaCpfService } from './../../shared/service/valida-cpf.service';
import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { TipoDocumento } from 'src/app/tipo-documento/tipo-documento';
import { TipoDocumentoService } from 'src/app/tipo-documento/tipo-documento.service';
import { DocumentoDialog } from './documento-dialog';
import { ValidaNumeroService } from 'src/app/shared/service/valida-numero.service';
import { cnpj, cpf } from 'cpf-cnpj-validator';
import { Documento } from '../documento';

@Component({
  selector: 'app-documento-dialog',
  templateUrl: './documento-dialog.component.html',
  styleUrls: ['./documento-dialog.component.scss']
})
export class DocumentoDialogComponent implements OnInit, OnDestroy {
  tipos: TipoDocumento[];
  inscricaoTipoDocumento$: Subscription;
  descricao: string;
  codigoTipo: number;
  titulo: string;
  documento: Documento;

  constructor(
    private serviceAlert: AlertService,
    private numeroService: ValidaNumeroService,
    private tipoDocumentoService: TipoDocumentoService,
    private validaCpfService: ValidaCpfService,
    @Inject(MAT_DIALOG_DATA) public data: DocumentoDialog
  ) { }
  ngOnInit(): void {
     this.tipos = this.data.tiposDocumento;
     this.documento = this.data.documento;
     this.titulo = this.documento.codigo === 0 ? 'Editar' : 'Novo';
     this.descricao = this.documento.descricao;
  }
  ngOnDestroy(): void {
    if (this.inscricaoTipoDocumento$) {
      this.inscricaoTipoDocumento$.unsubscribe();
    }
  }
  submit() {
    // validação dos campos
    if (this.validacaoCampos() === false) {
      return false;
    }
    // gravando os dados.
    // objeto a gravar
    const documentoGravar = this.documento;
    // documentoGravar.descricao = this.descricao.trim();
  }
  validacaoCampos() {
    if (this.documento.descricao === undefined || this.documento.descricao === null || this.documento.descricao.trim() === '') {
      this.handleError('Por favor, infomar a descrição e/ou valor do documento.');
      return false;
    } else {
      switch (this.codigoTipo) {
        case 2: // cpf
          // validar se foi digitado somente numeros
          if (this.numeroService.somenteNumero(this.documento.descricao.trim()) === false) {
            this.handleError('Por favor, informe somente números.');
            return false;
          }
          break;
        case 3: // cpf
          // validar se foi digitado somente numeros
          if (this.numeroService.somenteNumero(this.documento.descricao.trim()) === false) {
            this.handleError('Por favor, informe somente números.');
            return false;
          }
          break;

      }
    }
    // validando conforme tipo de documento
    switch (this.codigoTipo) {
      case 2: // cpf
        if (cpf.isValid(this.documento.descricao) === false) {
          this.handleError('C.P.F. inválido!');
          return false;
        }
        break;
      case 3: // cpnj
        if (cnpj.isValid(this.documento.descricao) === false) {
          this.handleError('C.N.P.J. inválido!');
          return false;
        }
        break;
    }
    return true;
  }
  handleError(msg: string) {
    this.serviceAlert.mensagemErro(msg);
  }
  handlerSuccess(msg: string) {
    this.serviceAlert.mensagemSucesso(msg);
  }
}
