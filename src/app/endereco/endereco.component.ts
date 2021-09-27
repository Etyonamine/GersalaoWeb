import { Component, Inject, OnInit } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { of, Subscription } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { ProfissionalEndereco } from '../profissional/profissional-endereco/profissional-endereco';
import { ProfissionalEnderecoService } from '../profissional/profissional-endereco/profissional-endereco.service';
import { AlertService } from '../shared/alert/alert.service';
import { ApiResult } from '../shared/base.service';
import { Municipio } from '../shared/municipios/municipio';
import { MunicipioService } from '../shared/service/municipio.service';
import { UnidadeFederativaService } from '../shared/service/unidade-federativa.service';
import { ValidaEndereco } from '../shared/service/valida-endereco';
import { UnidadeFederativa } from '../shared/UnidadeFederativa/unidadeFederativa';
import { Endereco } from './endereco';
import { EnderecoService } from './endereco.service';

export interface DialogData {
  origemChamada: number;
  codigo: number;
  codigoUsuario: number;
}

@Component({
  selector: 'app-endereco',
  templateUrl: './endereco.component.html',
  styleUrls: ['./endereco.component.scss']
})
export class EnderecoComponent  implements OnInit {
  constructor(
    private enderecoService: EnderecoService,
    private serviceAlert: AlertService,
    private unidadeFederativaService: UnidadeFederativaService,
    private municipioService: MunicipioService   ,
    private alertService: AlertService,
    private profissionalEnderecoService: ProfissionalEnderecoService,
    public dialogRef: MatDialogRef<EnderecoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}


  codigoEndereco: number ;

  endereco: Endereco;
  profissionalEndereco: Array<ProfissionalEndereco> = [];


  inscricaoProfissionalEndereco$: Subscription;
  inscricaoEndereco$: Subscription;
  inscricaoEstado$: Subscription;
  inscricaoMunicipio$: Subscription;
  estados: Array<UnidadeFederativa> = [];
  municipios: Array<Municipio> = [];

  ngOnInit(): void {

    this.recuperarDados();
    this.carregarEstados();
    this.carregarMunicipios();


  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngOnDestroy(): void {
    if (this.inscricaoEndereco$) {
      this.inscricaoEndereco$.unsubscribe();
    }
    if (this.inscricaoEstado$) {
      this.inscricaoEstado$.unsubscribe();
    }
    if (this.inscricaoMunicipio$) {
      this.inscricaoMunicipio$.unsubscribe();
    }
    if (this.inscricaoProfissionalEndereco$) {
      this.inscricaoProfissionalEndereco$.unsubscribe();
    }
  }

  submit() {
    // tslint:disable-next-line: ban-types
    let enderecoVazio: Boolean ;
    enderecoVazio = ValidaEndereco.propriedadesNulas(this.endereco);

    if (!enderecoVazio) {
      // mensagens
      let msgSucess = 'O endereço foi cadastrado com sucesso!';
      let msgError = 'Erro ao cadastrar outro Endereço!';

      if (this.endereco.codigo > 0 ) {

        // gravar o endereco
        this.enderecoService.save(this.endereco).subscribe(result => {
          msgSucess = 'O endereço foi atualizado com sucesso!';
          this.handlerSuccess(msgSucess);
        },
        error => {
          msgError = 'Erro ao atualizar o Endereço!';
          console.log(error);
          this.handleError(msgError);
        });
      } else {
          if (this.endereco.codigo > 0) {
            this.endereco.codigoUsuarioAlteracao = this.data.codigoUsuario;
            this.endereco.dataAlteracao = new Date();
          } else {
            this.endereco.codigoUsuarioCadastrado = this.data.codigoUsuario;
            this.endereco.dataCadastro = new Date();
          }

          this.endereco.codigoSituacao = 1;
          this.endereco.codigoTipoEndereco = 1;

          // gravar o endereco
          this.enderecoService.save(this.endereco)
                                      .pipe(
                                        concatMap(
                                          (result: Endereco) => {
                                          this.codigoEndereco = result.codigo;
                                          this.profissionalEndereco = [{codigoEndereco : this.codigoEndereco ,
                                                                        codigoProfissional : this.data.codigo,
                                                                        endereco : null,
                                                                        codigoUsuarioCadastro : this.data.codigoUsuario,
                                                                        dataCadastro : new Date()}];

                                          this.profissionalEnderecoService.save(this.profissionalEndereco[0])
                                                                                        .subscribe();

                                          return of (true);

                                        })
                                      )
                                      .subscribe(result => {
                                        if (result){
                                          this.handlerSuccess(msgSucess);
                                        }
                                      }, error => {
                                        console.log(error);
                                        this.handleError(msgError);
                                      });


      }
    } else {
      if (this.endereco.codigo > 0 ) {
           this.apagar();
      }
    }
  }

  apagar() {
    let codigo: number;

    if (this.data.origemChamada === 2) {
      if (this.profissionalEndereco !== undefined && this.profissionalEndereco !== null && this.profissionalEndereco.length !== 0) {
         codigo = this.profissionalEndereco[0].codigoProfissional;
         this.profissionalEnderecoService
                .excluirTodos(codigo, this.codigoEndereco)                
                  .subscribe(result =>{
                      if (result)
                      {
                        this.enderecoService.delete(this.codigoEndereco)
                                              .subscribe(result => {
                           this.recuperarDados();
                           this.handlerSuccess('Endereço excluido com sucesso!');
                        },error=>{
                            console.log(error);
                            this.handleError('Ocorreu um erro na tentativa de excluir o endereço.');          
                        });
                  
                      }
                    }, error => {
                  console.log (error);

                  this.handleError('Ocorreu um erro na tentativa de excluir o profissional endereço.');
                });
      } else {
        this.enderecoService.delete(this.endereco.codigo).subscribe(result => {
          this.handlerSuccess('Endereço excluido com sucesso!');
        }, error => {
          console.log (error);
          this.handleError('Ocorreu um erro na tentativa de excluir o endereço.');
        });
      }
    }
  }




  openConfirmExclusao() {
    const mensagem = `Tem certeza que deseja excluir o endereco ?`;

    this.alertService.openConfirmModal(mensagem, 'Excluir - Endereco', (answer: boolean) => {
      if (answer) {

        this.apagar();
      }
    }, 'Sim', 'Não'
    );
  }

  recuperarDados() {

    this.endereco =  {} as Endereco;
    this.codigoEndereco = 0;

    // tslint:disable-next-line: triple-equals
    if (this.data.origemChamada === 2) {

        this.inscricaoProfissionalEndereco$ = this.profissionalEnderecoService
                                                    .get<ProfissionalEndereco[]>(this.data.codigo)
                                                    .pipe(
                                                      concatMap((result: ProfissionalEndereco[]) => {
                                                        this.profissionalEndereco = result;
                                                        if (result !== undefined && result !== null && result.length !== 0) {
                                                          this.codigoEndereco = result[0].endereco.codigo;
                                                          this.inscricaoEndereco$ = this.enderecoService
                                                                                  .get<Endereco>(this.codigoEndereco)
                                                                                  .subscribe(endereco => {
                                                                                    this.endereco = endereco;
                                                                                    this.carregarMunicipios();

                                                                                  },
                                                                                  error => {
                                                                                    console.log(error);
                                                                                  });
                                                        }

                                                        return of(true);
                                                      })
                                                    )
                                                    .subscribe(result => {

                                                    },
                                                    error => {
                                                      console.error(error);
                                                      // tslint:disable-next-line: max-line-length
                                                      this.handleError('Erro ao carregar o endereço do profissional. Tente novamente mais tarde.');
                                                    });
    }
  }

  carregarEstados() {
    this.inscricaoEstado$ = this.unidadeFederativaService
      .getData<ApiResult<UnidadeFederativa>>(
        0,
        30,
        'descricao',
        'ASC',
        null,
        null,
      )
      .subscribe(result => {
        if (result.data !== null) {

          this.estados = result.data;
        }

      }, error => {
        console.error(error);
        this.handleError('Erro ao carregar a lista de estados. Tente novamente mais tarde.');
      });

  }

  carregarMunicipios() {
    this.municipios = [];
    if (this.endereco !== null && this.endereco !== undefined) {
      if (this.endereco.codigoUnidadeFederativa > 0) {
        this.inscricaoMunicipio$ = this.municipioService.getMunicipioPorUF<ApiResult<Municipio>>(
          this.endereco.codigoUnidadeFederativa,
          0,
          1000,
          'descricao',
          'ASC',
          null,
          null,
        ).subscribe(result => { this.municipios = result.data; });
      }
    }
  }

  handleError(msg: string) {
    this.serviceAlert.mensagemErro(msg);
  }

  handlerSuccess(msg: string) {
    this.serviceAlert.mensagemSucesso(msg);
  }

  onEstadoSelecionado() {
    this.carregarMunicipios();

  }



}
