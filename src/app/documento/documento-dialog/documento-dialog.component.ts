import { ProfissionalDocumentoService } from 'src/app/profissional/profissional-documento/profissional-documento.service';
import { ProfissionalDocumento } from 'src/app/profissional/profissional-documento/profissional-documento';
import { DocumentoService } from 'src/app/documento/documento.service';
import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { of, Subscription } from 'rxjs';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { TipoDocumento } from 'src/app/tipo-documento/tipo-documento';
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
  inscricaoDocumento$: Subscription;
  inscricaoTipoDocumento$: Subscription;
  descricao: string;
  codigoTipo: number;
  titulo: string;
  documento: Documento;
  blnEditar: boolean;
  constructor(
    private serviceAlert: AlertService,
    private numeroService: ValidaNumeroService,
    private documentoService: DocumentoService,
    private profissionalDocumentoService: ProfissionalDocumentoService,
    @Inject(MAT_DIALOG_DATA) public data: DocumentoDialog
  ) { }
  ngOnInit(): void {
     this.documento = this.data.documento;
     this.titulo = this.documento.codigo === 0 ? 'Editar' : 'Novo';
     this.blnEditar = this.documento.codigo === 0 ? false : true;
     this.montarComboTipo();
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
    const documentoGravar = this.documento;
    if (this.documento.codigo > 0 ) {
      documentoGravar.codigoUsuarioAlteracao = this.data.codigoUsuario;
    } else {
      documentoGravar.codigoUsuarioCadastro = this.data.codigoUsuario;
      documentoGravar.tipoDocumento = null;
    }

    // gravando os dados.
    // objeto a gravar
    this.documentoService.save(documentoGravar)
                         .subscribe(result => {
                              if (result && documentoGravar.codigo === 0 ) {
                                // gravando o profissional documento
                                const profissionalDocumento = {
                                  codigoProfissional : this.data.codigoProfissional,
                                  codigoDocumento : result.codigo,
                                  codigoUsuarioCadastro : this.data.documento.codigoUsuarioCadastro,
                                  dataCadastro : new Date(),
                                  documento : null
                                } as ProfissionalDocumento;
                                // gravando via servico
                                this.profissionalDocumentoService.save(profissionalDocumento)
                                                                .subscribe( profidoc => {
                                                                  if (profidoc) {
                                                                    return of (true);
                                                                  }
                                                                },
                                                                  error => {
                                                                    console.log(error);
                                                                    this.handleError(
                                                                      'Ocorreu um erro na tentativa de salvar o Novo registro.'
                                                                    );
                                                                  });
                              }
                              this.handlerSuccess('Registro salvo com sucesso!');
                         },
                          error => {
                            console.log(error);
                          });
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
  montarComboTipo() {
    if (this.blnEditar === true) {
      this.tipos = [this.documento.tipoDocumento];
    } else {
      this.tipos = this.data.tiposDocumento;
    }
  }
}
