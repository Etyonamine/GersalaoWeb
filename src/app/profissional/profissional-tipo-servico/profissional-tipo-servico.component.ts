import { AlertService } from 'src/app/shared/alert/alert.service';
import { ProfissionalTipoServicoService } from './profissional-tipo-servico.service';
import { Component, Inject, OnInit } from '@angular/core';
import { ProfissionalTipoServico } from './profissional-tipo-servico';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogDataProfissional } from '../DialogDataProfissional';
import { EMPTY } from 'rxjs';

@Component({
  selector: 'app-profissional-tipo-servico',
  templateUrl: './profissional-tipo-servico.component.html',
  styleUrls: ['./profissional-tipo-servico.component.scss']
})
export class ProfissionalTipoServicoComponent implements OnInit {
  colunas = 'Grupo,valorComissao';
  habilitaNovo: boolean;
  profissionalTipoServicos: Array<ProfissionalTipoServico>;

  constructor(
    private profissionalTipoServicoService: ProfissionalTipoServicoService,
    private serviceAlert: AlertService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: DialogDataProfissional
  ) { }
  ngOnInit(): void {
  }
  loadData(query: string = null) {
    this.habilitaNovo = false;

    // profissional

       this.profissionalTipoServicoService.get<ProfissionalTipoServico[]>(this.data.codigo)
                                        .subscribe(result => {
                                          if (result) {
                                            this.profissionalTipoServicos = result;
                                          }
                                        }, error => {
                                          console.error(error);
                                          this.handleError('Ocorreu erro na tentativa de recuperar a lista de documentos do profissional.');
                                          {
                                            return EMPTY;
                                          }
                                        });

  }
  openDialogNovo() {

  }
  openDialogEditar(profissionalTipoServico: ProfissionalTipoServico) {

  }
  openDialogApagar(codigo: number) {

  }
  handleError(msg: string) {
    this.serviceAlert.mensagemErro(msg);
  }
  handlerSuccess(msg: string) {
    this.serviceAlert.mensagemSucesso(msg);
  }
}
