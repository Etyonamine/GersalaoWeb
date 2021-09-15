import { Component, Inject, OnInit } from '@angular/core';
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
  codigoUsuario:number;
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
    private profissionalEnderecoService : ProfissionalEnderecoService,
    public dialogRef: MatDialogRef<EnderecoComponent>,
    @Inject(MAT_DIALOG_DATA) public data:DialogData,

  )
  {}


  codigoEndereco: number ;

  endereco:Endereco;
  profissionalEndereco: Array<ProfissionalEndereco> =[];


  inscricaoProfissionalEndereco$:Subscription;
  inscricaoEndereco$: Subscription;
  inscricaoEstado$:Subscription;
  inscricaoMunicipio$:Subscription;
  estados: Array<UnidadeFederativa> = [];
  municipios: Array<Municipio> = [];

  ngOnInit(): void {

    this.recuperarDados();
    this.carregarEstados();
    this.carregarMunicipios();


  }

  ngOnDestroy():void{
    if (this.inscricaoEndereco$){
      this.inscricaoEndereco$.unsubscribe();
    }
    if (this.inscricaoEstado$) {
      this.inscricaoEstado$.unsubscribe();
    }
    if (this.inscricaoMunicipio$) {
      this.inscricaoMunicipio$.unsubscribe();
    }
    if (this.inscricaoProfissionalEndereco$){
      this.inscricaoProfissionalEndereco$.unsubscribe;
    }
  }

  submit() {
    var enderecoVazio :Boolean ;
    enderecoVazio = ValidaEndereco.propriedadesNulas(this.endereco);

    if (!enderecoVazio){
      //mensagens
      let msgSucess = 'O endereço foi cadastrado com sucesso!';
      let msgError = 'Erro ao cadastrar outro Endereço!';

      if (this.endereco.codigo > 0 ){

        //gravar o endereco
        this.enderecoService.save(this.endereco).subscribe(result=>{
          msgSucess = 'O endereço foi atualizado com sucesso!';
          this.handlerSuccess(msgSucess);
        },
        error=>{
          msgError = 'Erro ao atualizar o Endereço!';
          console.log(error);
          this.handleError(msgError);
        });
      }
      else
      {
          if(this.endereco.codigo>0){
            this.endereco.codigoUsuarioAlteracao = this.data.codigoUsuario;
            this.endereco.dataAlteracao = new Date();
          }else{
            this.endereco.codigoUsuarioCadastrado = this.data.codigoUsuario;
            this.endereco.dataCadastro = new Date();
          }

          this.endereco.codigoSituacao = 1;
          this.endereco.codigoTipoEndereco = 1;

          //gravar o endereco
            this.enderecoService.save(this.endereco)
                                      .pipe(
                                        concatMap(
                                          (result:Endereco)=>
                                          {
                                          this.codigoEndereco = result.codigo;
                                          this.profissionalEndereco = [{CodigoEndereco : this.codigoEndereco ,
                                                                        CodigoProfissional : this.data.codigo,
                                                                        Endereco : null}];

                                          this.profissionalEnderecoService.save(this.profissionalEndereco[0])
                                                                                        .subscribe();

                                          return of (true);

                                        })
                                      )
                                      .subscribe(result=>{
                                        this.handlerSuccess(msgSucess)

                                      },error=>{
                                        console.log(error);
                                        this.handleError(msgError)
                                      });


      }
    }else{
      if (this.endereco.codigo > 0 )
      {
           this.apagar();
      }
    }
  }

  apagar()
  {
    if (this.profissionalEndereco != undefined && this.profissionalEndereco !== null){
      this.profissionalEnderecoService.excluirTodos(this.profissionalEndereco[0].CodigoProfissional, this.profissionalEndereco[0].CodigoEndereco).subscribe(result=>{
        this.enderecoService.delete(this.endereco.codigo).subscribe(result=>{
          this.handlerSuccess("Endereço excluido com sucesso!");
        });
      },error=>{
        console.log (error);
        this.handleError("Ocorreu um erro na tentativa de excluir o endereço.");
      });
    }
    else
    {
      this.enderecoService.delete(this.endereco.codigo).subscribe(result=>{
        this.handlerSuccess("Endereço excluido com sucesso!");
      }, error=>{
        console.log (error);
        this.handleError("Ocorreu um erro na tentativa de excluir o endereço.");
      });
    }
  }

  recuperarDados (){

    this.endereco = <Endereco>{};


    this.codigoEndereco = 0;

    if (this.data.origemChamada == 2)//profissional
    {
        this.inscricaoProfissionalEndereco$ = this.profissionalEnderecoService.get<ProfissionalEndereco[]>(this.data.codigo)
                                                    .subscribe(result=>{
                                                                        this.profissionalEndereco = result;

                                                                        if (this.profissionalEndereco[0]!==null &&
                                                                            this.profissionalEndereco[0]!== undefined)
                                                                        {
                                                                              this.endereco = this.profissionalEndereco[0].Endereco;
                                                                              this.codigoEndereco = this.endereco.codigo;

                                                                              if (this.endereco!=null &&
                                                                                  this.endereco!=undefined &&
                                                                                  this.endereco.codigoMunicipio >0
                                                                                  && this.endereco.codigoUnidadeFederativa > 0 )
                                                                              {
                                                                                  this.carregarMunicipios();
                                                                              }
                                                                        }
                                                                      },
                                                              error=>{
                                                                console.error(error);
                                                                this.handleError('Erro ao carregar o endereço do profissional. Tente novamente mais tarde.');
                                                              });
    }
  }

  carregarEstados() {
    this.inscricaoEstado$ = this.unidadeFederativaService
      .getData<ApiResult<UnidadeFederativa>>(
        0,
        30,
        "descricao",
        "ASC",
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
    if (this.endereco!== null && this.endereco !==undefined)
    {
      if (this.endereco.codigoUnidadeFederativa >0){
        this.inscricaoMunicipio$ = this.municipioService.getMunicipioPorUF<ApiResult<Municipio>>(
          this.endereco.codigoUnidadeFederativa,
          0,
          1000,
          "descricao",
          "ASC",
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

  onEstadoSelecionado(){
    this.carregarMunicipios();

  }



}
