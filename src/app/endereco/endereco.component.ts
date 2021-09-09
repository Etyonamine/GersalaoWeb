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
  profissionalEndereco: ProfissionalEndereco;

  submit() {
    var enderecoVazio :Boolean ;
    enderecoVazio = ValidaEndereco.propriedadesNulas(this.endereco);

    if (!enderecoVazio){
      //gravar o endereco 
    /* this.inscricaoEndereco$ = this.enderecoService.save(this.endereco).pipe(
      concatMap((result: end) => {
        if (this.codigo == 0) {
          this.cliente = result;
        }

        if (this.gravarDadosEnderecos) {
          this.enderecoService.save(this.endereco).subscribe(sucesso => {
            if (sucesso !== undefined && sucesso !== null) {
              this.clienteEnderecos[0].codigoCliente = this.cliente.codigo;
              this.clienteEnderecos[0].codigoEndereco = sucesso.codigo;
              this.clienteEnderecos[0].endereco = null;
              this.clienteEnderecoService.save(this.clienteEnderecos[0]).subscribe();
            }

          });
        }
        return of(true);
      })).subscribe(result=>{

    }) */
    }

    
  }

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
 
  recuperarDados (){

    if (this.data.origemChamada == 2)//profissional
    {
      this.inscricaoProfissionalEndereco$ = this.profissionalEnderecoService.get<ProfissionalEndereco>(this.data.codigo).subscribe(result=>{
        this.profissionalEndereco = result;
      },
      error=>{
        console.error(error);
        this.handleError('Erro ao carregar o endereço do profissional. Tente novamente mais tarde.');
      })

      this.codigoEndereco = this.profissionalEndereco !== undefined && this.profissionalEndereco !== null ? this.profissionalEndereco.CodigoEndereco:0;
    }
     
    if (this.codigoEndereco!== undefined && this.codigoEndereco!== 0){
      this.inscricaoEndereco$ = this.enderecoService.get<Endereco>(this.codigoEndereco).subscribe(result=> this.endereco = result);     
    }else{
      this.endereco = <Endereco>{};
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
      if ((this.endereco.codigoUnidadeFederativa >=0 && this.estados!== undefined)&&(this.endereco.codigoUnidadeFederativa !=0)){
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
      else
      {
        this.municipios = [];
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
