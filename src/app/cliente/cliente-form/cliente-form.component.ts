
import { Contato } from 'src/app/contato/contato';
import { ContatoService } from './../../contato/contato.service';
import { EnderecoService } from './../../endereco/endereco.service';
import { FormValidations } from './../../shared/service/form-validations';
import { Documento } from './../../documento/documento';
import { Login } from './../../login/login';
import { ClienteDocumentoService } from './../cliente-documento/cliente-documento.service';
import { ClienteContatoService } from './../cliente-contato/cliente-contato.service';
import { ClienteEnderecoService } from './../cliente-endereco/cliente-endereco.service';
import { Endereco } from './../../endereco/endereco';
import { ValidaCpfService } from './../../shared/service/valida-cpf.service';
import { MunicipioService } from './../../shared/service/municipio.service';
import { AlertService } from './../../shared/alert/alert.service';
import { UnidadeFederativaService } from './../../shared/service/unidade-federativa.service';
import { ClienteService } from './../cliente.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, UntypedFormBuilder, UntypedFormGroup, ValidationErrors, Validators } from '@angular/forms';
import { EMPTY, Observable, of, Subscription } from 'rxjs';
import { Cliente } from '../cliente';
import { concatMap, map, switchMap, take } from 'rxjs/operators';
import { UnidadeFederativa } from 'src/app/shared/UnidadeFederativa/unidadeFederativa';
import { ApiResult } from 'src/app/shared/base.service';
import { Municipio } from 'src/app/shared/municipios/municipio';
import { ActivatedRoute, Router } from '@angular/router';
import { ClienteEndereco } from '../cliente-endereco';
import { ClienteContato } from '../cliente-contato/cliente-contato';
import { ClienteDocumento } from '../cliente-documento/cliente-documento';
import { BaseFormComponent } from 'src/app/shared/base-form/base-form.component';
import { DocumentoService } from 'src/app/documento/documento.service';
import { MatDialog } from '@angular/material/dialog';
import { ClienteFormaPagamentoComponent } from '../cliente-forma-pagamento/cliente-forma-pagamento.component';
import { AuthService } from 'src/app/auth-guard/auth.service';




@Component({
  selector: 'app-cliente-form',
  templateUrl: './cliente-form.component.html',
  styleUrls: ['./cliente-form.component.scss']
})

export class ClienteFormComponent extends BaseFormComponent implements OnInit, OnDestroy {
  codigoLogin: number;
  login: Login;
  formulario: UntypedFormGroup;

  cliente: Cliente;
  clienteEnderecos: Array<ClienteEndereco> = [];
  clienteContatos: Array<ClienteContato> = [];
  clienteDocumentos: Array<ClienteDocumento> = [];

  endereco: Endereco;
  habilitaApagar: boolean = false;
  habilitaBotao: boolean;
  mostrarTab: boolean;
  submissao: boolean = false;

  tituloPagina: string = '';
  descricaoBotaoSalvarEndereco: string = 'Incluir';

  codigo?: number;
  codigoUnidadeFederativa: number = 0;
  codigoMunic: number;
  email: string = '';
  telefoneFixo: string = '';
  celular: string = '';

  optionSituacao: Array<Object> = [{ value: 1, name: "Ativo" }, { value: 2, name: "Inativo" }];

  estados: Array<UnidadeFederativa> = [];
  municipios: Array<Municipio> = [];

  inscricaoEstado$: Subscription;
  inscricaoEndereco$: Subscription;
  inscricaoContato$: Subscription;
  inscricaoDocumento$: Subscription;


  valorEnderecoMudou: boolean = false;
  valorContatoMudou: boolean = false;
  valorDocumentoMudou: boolean = false;

  gravarDadosEnderecos: boolean = false;
  gravarDadosContatos: boolean = false;
  gravarDadosDocumentos: boolean = false;
  location: any;
  
  
  constructor(
    private formBuilder: UntypedFormBuilder,    
    private clienteService: ClienteService,
    private unidadeFederativaService: UnidadeFederativaService,
    private municipioService: MunicipioService,  
    private validarCpf: ValidaCpfService,
    private clienteEnderecoService: ClienteEnderecoService,
    private clienteContatoService: ClienteContatoService,
    private clienteDocumentoService: ClienteDocumentoService,
    private contatoService: ContatoService,
    private documentoService: DocumentoService,
    private enderecoService: EnderecoService,
    private serviceAlert: AlertService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog ,
    private authService: AuthService 
  ) {
    super();
  }

  ngOnInit(): void {
    this.cliente = this.route.snapshot.data['cliente'];
    this.login = <Login>{};

    if (this.cliente == undefined) {
      this.cliente = <Cliente>{
        codigo: 0,
        codigousuariocadastro: 1,
        codigousuarioalteracao: null,
        codigoSituacao: 1,
        nome: null,
        dataaniversario: null,
        dataalteracao: null,
        datacadastro: new Date(),
        observacao: null
      };
      //endereco
      this.criarObjetoEndereco();
    }

    this.codigo = this.cliente !== undefined ? this.cliente.codigo : 0;
    this.habilitaApagar = this.codigo > 0 ? false : true;
    this.carregarEstados();

    //criação dos formularios ************************************************
    //formulario cliente
    this.formulario = this.formBuilder.group({
      codigo: [null],
      nome: [null, [Validators.required,this.isDupeCliente]],
      //dataaniversario: [null, [Validators.pattern('^([0]?[1-9]|[1|2][0-9]|[3][0|1])[./-]([0]?[1-9]|[1][0-2])[./-]([0-9]{4}|[0-9]{2})$')]],
      dataaniversario: [null, [Validators.pattern('^([0]?[1-9]|[1|2][0-9]|[3][0|1])[./-]([0]?[1-9]|[1][0-2])[./-]([0-9]{4})$')]],
      codigoSituacao: [1, [Validators.required]],
      observacao: [null],
      endereco: this.formBuilder.group({
        rua: [null],
        cep: [null, [Validators.minLength(8), Validators.pattern(/^-?(0|[0-9]\d*)?$/)]],
        numero: [null],
        complemento: [null],
        bairro: [null],
        municipio: [null],
        estado: [null]
      }),
      contato: this.formBuilder.group({
        telefoneFixo: [null, [Validators.minLength(10), Validators.pattern(/^-?(0|[0-9]\d*)?$/)]],
        celular: [null, [Validators.minLength(11), Validators.pattern(/^-?(0|[0-9]\d*)?$/)]],
        email: [null, [Validators.email]]
      }),
      documento: this.formBuilder.group({
        rg: [null],
        cpf: [null, [Validators.minLength(11), this.validarCpf.isValidCpf()]]
      })
    });

    //Inicializando
    this.formulario.get('endereco.estado')
      .valueChanges
      .pipe(
        map(estado => this.estados.filter(e => e.codigo === estado)),
        map(estados => estados && estados.length > 0 ? estados[0].codigo : EMPTY),
        switchMap(
          (estadoId: number) => {
            this.municipios = [];
            this.formulario.get('endereco.municipio').setValue(0);

            if (estadoId && estadoId !== undefined && estadoId > 0) {

              return this.municipioService.getMunicipioPorUF<ApiResult<Municipio>>(
                estadoId,
                0,
                1000,
                "descricao",
                "ASC",
                null,
                null,
              );
            } else {
              return EMPTY;
            }
          }
        )
      ).subscribe(result => { this.municipios = result.data; });

    if (this.codigo > 0) {
      this.listaEnderecos();
      this.listaContatos();
      this.listaDocumentos()
      this.populaDadosForm();
    }

    //ouvidores

    this.inscricaoEndereco$ = this.formulario.get('endereco').valueChanges.subscribe(
      (selectedValue) => this.valorEnderecoMudou = true);
    this.inscricaoContato$ = this.formulario.get('contato').valueChanges.subscribe(
      (selectedValue) => this.valorContatoMudou = true);
    this.inscricaoDocumento$ = this.formulario.get('documento').valueChanges.subscribe(
      (selectedValue) => this.valorDocumentoMudou = true);

    this.rotulos_modos_operacao();

    this.codigoLogin = Number(this.authService.usuarioLogado.codigo);
  }

  ngOnDestroy(): void {

    if (this.inscricaoEndereco$) {
      this.inscricaoEndereco$.unsubscribe();
    }
    if (this.inscricaoEstado$) {
      this.inscricaoEstado$.unsubscribe();
    }
    if (this.inscricaoContato$) {
      this.inscricaoContato$.unsubscribe();
    }
    if (this.inscricaoDocumento$) {
      this.inscricaoDocumento$.unsubscribe();
    }



  }

  submit() {

    this.atualizarObjetos();

    //mensagens
    let msgSucess = 'Cliente cadastrado com sucesso!';
    let msgError = 'Erro ao cadastrar outro cliente!';

    if (this.formulario.get('codigo').value > 0) {
      msgSucess = 'Cadastro atualizado com sucesso!';
      msgError = 'Erro ao atualizar o cadastro!';
    }



    this.clienteService.save(this.cliente).pipe(
      //endereco
      concatMap((result: Cliente) => {
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
      }),//cliente contato
      concatMap(result => {
        this.clienteContatos.forEach(element => {
          this.contatoService.save(element.contato).subscribe(sucesso => {
            if (sucesso !== undefined && sucesso !== null) {
              element.codigoCliente = this.cliente.codigo,
                element.codigoContato = sucesso.codigo,
                element.contato = null


              this.clienteContatoService.save(element).subscribe(result => element => result);
            }

          })
        });
        return of(true);
      }), //cliente documento
      concatMap(result => {
        this.clienteDocumentos.forEach(element => {
          this.documentoService.save(element.Documento).subscribe(sucesso => {
            if (sucesso !== undefined && sucesso !== null) {
              element.codigoCliente = this.cliente.codigo;
              element.codigoDocumento = sucesso.codigo;
              element.Documento = null;
              this.clienteDocumentoService.save(element).subscribe(result => element => result);
            }
          })
        })
        return of(true);
      })
    ).subscribe(sucesso => {
      this.handlerSuccess(msgSucess);
      setTimeout(() => { this.retornar(); }, 3000);
    });

  }
  incluir_ClienteContato(clienteContato) {

    this.clienteContatoService.save(clienteContato).subscribe();
  }

  atualizarObjetos() {

    let valueSubmit = Object.assign({}, this.formulario.value);
    var dataNiver : Date;
    if (valueSubmit.dataaniversario !== null  && valueSubmit.dataaniversario !== ''){
      var dataAux = valueSubmit.dataaniversario;
      var dataresult = dataAux.substring(6,10) + '-' + dataAux.substring(3,5) + '-' + dataAux.substring(0,2) + 'T00:00:00';
      dataNiver = new Date(dataresult);
    }else{
      dataNiver = null;
    }


    var index: number = -1;

    //cliente
    this.cliente.nome = valueSubmit.nome;
    this.cliente.codigoSituacao = valueSubmit.codigoSituacao;
    this.cliente.dataaniversario = dataNiver;
    this.cliente.observacao = valueSubmit.observacao;
    this.cliente.dataaniversario = dataNiver;

    //cliente-endereco
    if (this.valorEnderecoMudou) {

      var dadosEndereco = Object.assign({}, valueSubmit.endereco);

      if (this.valoresNulosEndereco()) {
        this.clienteEnderecos.splice(0, 1);
        this.clienteEnderecoService.excluirTodos(this.clienteEnderecos)
          .pipe(
            map(result => {
              this.enderecoService.delete(this.clienteEnderecos[0].endereco)
            }));
      }
      else {

        this.gravarDadosEnderecos = true;

        if (this.endereco !== undefined) {
          this.endereco.descricao = dadosEndereco.rua;
          this.endereco.numero = dadosEndereco.numero;
          this.endereco.bairro = dadosEndereco.bairro;
          this.endereco.cep = dadosEndereco.cep !== null && dadosEndereco.cep !== '' ? dadosEndereco.cep : null;
          this.endereco.complemento = dadosEndereco.complemento;
          this.endereco.codigoUnidadeFederativa = dadosEndereco.estado > 0 && dadosEndereco.estado !== undefined && dadosEndereco.municipio > 0 ? dadosEndereco.estado : null;
          this.endereco.codigoMunicipio = dadosEndereco.estado > 0 && dadosEndereco.municipio > 0 && dadosEndereco.municipio !== undefined ? dadosEndereco.municipio : null;
          this.endereco.dataCadastro = new Date();
          this.endereco.codigoSituacao = 1;
          this.endereco.codigoUsuarioCadastrado = 1;
          this.endereco.codigoTipoEndereco = 1;

        }
        else {
          this.endereco = <Endereco>{
            codigo: 0,
            descricao: dadosEndereco.rua,
            numero: dadosEndereco.numero,
            bairro: dadosEndereco.bairro,
            cep: dadosEndereco.cep !== null && dadosEndereco.cep !== '' ? dadosEndereco.cep : null,
            complemento: dadosEndereco.complemento,
            codigoUnidadeFederativa: dadosEndereco.estado !== undefined ? dadosEndereco.estado : null,
            codigoMunicipio: dadosEndereco.municipio !== undefined ? dadosEndereco.municipio : null,
            dataCadastro: new Date(),
            codigoSituacao: 1,
            codigoUsuarioCadastrado: 1,
            codigoTipoEndereco: 1

          };
        }
        if (this.clienteEnderecos.length > 0) {

          this.clienteEnderecos[0].endereco = this.endereco;
        }
        else {
          this.clienteEnderecos = [{
            codigoCliente: this.codigo > 0 ? this.codigo : 0,
            codigoEndereco: this.endereco.codigo > 0 ? this.codigo : 0,
            endereco: this.endereco
          }];
        }
      }
    }

    //cliente-contato
    if (this.valorContatoMudou) {
      var dadosContato = valueSubmit.contato;

      var camposContato: Array<string> = ["contato.telefoneFixo",
        "contato.celular",
        "contato.email"
      ];

      //apaga todos os itens
      if (FormValidations.validaTodosControlesNulosOuVazios(camposContato, this.formulario)) {
        if (this.clienteContatos.length > 0) {
          if (this.codigo > 0) {
            this.clienteContatos.forEach(element => {
              this.excluirClienteContato_Contato(element);
            });
          }
          this.clienteContatos.splice(0, this.clienteContatos.length);

        }
      }
      else {
        this.gravarDadosContatos = true;

        var contatoTelefone: any;
        var contatoCelular: any;
        var contatoEmail: any;

        if ((this.clienteContatos.length > 0) && (this.codigo)) {
          contatoTelefone = this.clienteContatos.filter(e => e.contato.codigoTipoContato == 1);
          contatoCelular = this.clienteContatos.filter(e => e.contato.codigoTipoContato == 2);
          contatoEmail = this.clienteContatos.filter(e => e.contato.codigoTipoContato == 3);
        }

        //Telefone fixo ********************************************************
        //excluir do array e da base
        if (dadosContato.telefoneFixo == null || dadosContato.telefoneFixo == '') {
          if (contatoTelefone !== null && contatoTelefone !== undefined) {
            index = this.clienteContatos.indexOf(contatoTelefone[0]);
            if (index !== -1) {
              this.clienteContatos.splice(index, 1);
              if (this.codigo > 0) {
                this.excluirClienteContato_Contato(contatoTelefone[0]);
              }
            }
          }
        } else {
          var contatoBase = <Contato>{
            codigo: 0,
            descricao: dadosContato.telefoneFixo,
            codigoTipoContato: 1,
            codigosituacao: 1,
            codigoUsuarioCadastrado: (this.codigo ? this.login.codigo : this.codigoLogin),
            codigoUsuarioAlteracao: (this.codigo ? this.codigoLogin : null)
          };

          //caso nao exista no array de clientes contatos
          if (contatoTelefone == undefined) {

            contatoBase.codigo = 0;

            this.clienteContatos.push({
              codigoCliente: this.codigo,
              codigoContato: 0,
              contato: contatoBase
            });

          } else {
            index = this.clienteContatos.indexOf(contatoTelefone[0]);

            if (index !== -1) {

              this.clienteContatos[index].contato.descricao = dadosContato.telefoneFixo;
            }
          }
        }

        //celular ************************************
        if (dadosContato.celular == null || dadosContato.celular == '') {
          if (contatoCelular !== undefined) {
            index = this.clienteContatos.indexOf(contatoCelular[0]);
            if (index !== -1) {
              this.clienteContatos.splice(index, 1);

              if (this.codigo > 0) {
                this.excluirClienteContato_Contato(contatoCelular[0]);
              }
            }
          }
        } else {

          var contatoBase = <Contato>{
            codigo: 0,
            descricao: dadosContato.celular,
            codigoTipoContato: 2,
            codigosituacao: 1,
            codigoUsuarioCadastrado: (this.codigo ? this.login.codigo : this.codigoLogin),
            codigoUsuarioAlteracao: (this.codigo ? this.codigoLogin : null)
          };

          if (contatoCelular.length == 0) {
            this.clienteContatos.push({
              codigoCliente: this.codigo,
              codigoContato: 0,
              contato: contatoBase
            });
          } else {
            index = this.clienteContatos.indexOf(contatoCelular[0]);
            if (index !== -1) {
              this.clienteContatos[index].contato.descricao = dadosContato.celular;

            }
          }
        }
        //email ************************************************
        if (dadosContato.email == null || dadosContato.email == '') {
          if (contatoEmail !== null && contatoEmail == undefined) {
            index = this.clienteContatos.indexOf(contatoEmail[0]);
            if (index !== -1) {
              this.clienteContatos.splice(index, 1);
              if (this.codigo > 0) {
                this.excluirClienteContato_Contato(contatoEmail[0]);
              }
            }
          }
        } else {
          var contatoBase = <Contato>{
            codigo: 0,
            descricao: dadosContato.email,
            codigoTipoContato: 3,
            codigosituacao: 1,
            codigoUsuarioCadastrado: (this.codigo ? this.login.codigo : this.codigoLogin),
            codigoUsuarioAlteracao: (this.codigo ? this.codigoLogin : null)
          };
          if (contatoEmail == undefined) {
            this.clienteContatos.push({
              codigoCliente: this.codigo,
              codigoContato: 0,
              contato: contatoBase
            });
          } else {
            index = this.clienteContatos.indexOf(contatoEmail[0]);
            if (index !== -1) {
              this.clienteContatos[index].contato.descricao = dadosContato.email;
            }
          }
        }
      }
    }

    //cliente-documento
    if (this.valorDocumentoMudou) {

      var dadosDocumentos = valueSubmit.documento;

      var camposDocumentos: Array<string> = ["documento.rg",
        "documento.cpf"
      ];

      if (FormValidations.validaTodosControlesNulosOuVazios(camposDocumentos, this.formulario)) {
        if (this.clienteDocumentos.length > 0) {

          if (this.codigo > 0) {
            this.clienteDocumentos.forEach(element => {
              this.excluirClienteDocumento_Documentos(element);
            })

          }

          this.clienteDocumentos.splice(0, this.clienteDocumentos.length);
        }
      } else {
        var documentoRG: any;
        var documentoCpf: any;

        this.gravarDadosDocumentos = true;

        if (this.clienteDocumentos.length > 0) {
          documentoRG = this.clienteDocumentos.filter(d => d.Documento.codigoTipoDocumento == 1);
          documentoCpf = this.clienteDocumentos.filter(d => d.Documento.codigoTipoDocumento == 2);
        }

        //RG *******************************************************
        if (dadosDocumentos.rg == null || dadosDocumentos.rg == '') {
          if (documentoRG.length > 0) {
            index = this.clienteDocumentos.indexOf(documentoRG[0]);
            if (index !== -1) {
              this.clienteDocumentos.splice(index, 1);
              if (this.codigo > 0) {
                this.excluirClienteDocumento_Documentos(documentoRG[0]);
              }
            }
          }
        }
        else {
          if (documentoRG !== undefined) {
            index = this.clienteDocumentos.indexOf(documentoRG[0]);
            this.clienteDocumentos[index].Documento.descricao = dadosDocumentos.rg;

          }
          else {
            if (dadosDocumentos.rg !== null && dadosDocumentos.rg !== '') {
              var documentoRgValor = <Documento>{
                codigo: 0,
                codigoTipoDocumento: 1,
                codigoSituacao: 1,
                descricao: dadosDocumentos.rg,
                dataCadastro: new Date(),
                codigoUsuarioCadastro: 1,
                dataAlteracao: null,
                codigoUsuarioAlteracao: null,
              };

              this.clienteDocumentos.push({
                codigoCliente: this.codigo,
                codigoDocumento: 0,
                Documento: documentoRgValor
              });
            }
          }
        }

        //CPF *******************************************************
        if (dadosDocumentos.cpf == null || dadosDocumentos.cpf == '') {
          if (documentoCpf!== undefined) {
            var index = this.clienteDocumentos.indexOf(documentoCpf[0]);

            //removendo do array
            if (index !== -1) {
              this.clienteDocumentos.splice(index, 1);
              if (this.codigo > 0) {
                this.excluirClienteDocumento_Documentos(documentoCpf[0]);
              }
            }
          }
        } else {
          if (documentoCpf.length > 0) {
            index = this.clienteDocumentos.indexOf(documentoCpf[0]);
            this.clienteDocumentos[index].Documento.descricao = dadosDocumentos.cpf;

          } else {

            this.clienteDocumentos.push(
              {
                codigoCliente: (this.codigo ? this.codigo : 0),
                codigoDocumento: documentoCpf.length > 0 ? documentoCpf.codigo : 0,
                Documento: <Documento>{
                  codigo: documentoCpf.length > 0 ? documentoCpf.codigo : 0,
                  descricao: dadosDocumentos.cpf,
                  codigoTipoDocumento: 2,
                  codigoSituacao: documentoCpf.length > 0 ? documentoCpf.codigoSituacao : 1,
                  codigoUsuarioCadastro: 1,
                  codigoUsuarioAlteracao: null
                }
              }
            );
          }
        }
      }
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

  //** validar se existe*/
  isDupeCliente(): AsyncValidatorFn {


    return (control: AbstractControl): Observable<ValidationErrors | null> => {

      //verificando se é um caso de ediçao ou novo registro
      var clienteValidar = (this.codigo) ? this.cliente : <Cliente>{};

      clienteValidar.codigo = this.codigo;
      clienteValidar.nome = this.formulario.get('nome').value;

      return this.clienteService.isDupeCliente(clienteValidar).pipe(map(result => {
        return (result ? { isDupeCliente: true } : null);
      }));
    }
  }

  //**  validações de campos */
  //email
  getErrorMessage() {
    if (this.formulario.get('email').hasError('required')) {
      return 'Por favor, informe um e-mail válido!';
    }

    return this.formulario.get('email').hasError('email') ? 'Formato de e-mail inválido!' : '';
  }

  handleError(msg: string) {
    this.serviceAlert.mensagemErro(msg);
  }

  handlerSuccess(msg: string) {
    this.serviceAlert.mensagemSucesso(msg);
  }

  populaDadosForm() {

    var dateniver = (this.cliente.dataaniversario != undefined) ? new Date(this.cliente.dataaniversario).toLocaleDateString("pt-br") : '';


    this.formulario.patchValue({
      codigo: this.cliente.codigo,
      nome: this.cliente.nome,
      codigoSituacao: this.cliente.codigoSituacao,
      observacao: this.cliente.observacao,
      dataaniversario: dateniver
    });
  }
  retornar() {
    this.router.navigate(['/cliente']);
  }

  rotulos_modos_operacao() {
    this.tituloPagina = this.codigo ? 'Editar-registro' : 'Novo-registro';


  }

  listaEnderecos() {

    this.clienteEnderecoService
      .get<ClienteEndereco[]>(this.cliente.codigo)
      .subscribe(result => {
        this.descricaoBotaoSalvarEndereco = 'Incluir';

        this.clienteEnderecos = result;

        if (result.length > 0) {
          this.descricaoBotaoSalvarEndereco = 'Atualizar';
          this.endereco = this.clienteEnderecos[0].endereco;
          this.codigoUnidadeFederativa = (
              this.endereco.codigoUnidadeFederativa !== undefined &&
              this.endereco.codigoUnidadeFederativa) ? this.endereco.codigoUnidadeFederativa : 0;
          this.codigoMunic = (
              this.endereco.codigoMunicipio && this.endereco.codigoMunicipio !== undefined) ? this.endereco.codigoMunicipio : 0;

          this.formulario.patchValue({
            endereco: {
              rua: this.endereco.descricao,
              numero: this.endereco.numero,
              complemento: this.endereco.complemento,
              bairro: this.endereco.bairro,
              cep: this.endereco.cep == 0 ? this.endereco.cep : '',
              estado : this.codigoUnidadeFederativa > 0 ? this.codigoUnidadeFederativa : null,
              municipio : this.codigoMunic > 0 ? this.codigoMunic : null
            }
          });

          // if (this.codigoUnidadeFederativa > 0 && this.codigoMunic > 0) {
          //   this.formulario.get('endereco.estado').setValue(this.codigoUnidadeFederativa);
          //   this.formulario.get('endereco.municipio').setValue(this.codigoMunic);
          // }
        }
      },
        error => {
          console.log(error);
          this.handleError('Ocorreu erro na tentativa de recuperar o endereço do cliente.')
        });
  }

  listaContatos() {
    this.clienteContatoService
      .get<ClienteContato[]>(this.codigo)
      .subscribe(result => {

        this.clienteContatos = result;
        if (result.length > 0) {
          var emailObj = this.clienteContatos.filter(e => e.contato.codigoTipoContato == 3);
          var telefoneObj = this.clienteContatos.filter(e => e.contato.codigoTipoContato == 1);
          var celularObj = this.clienteContatos.filter(e => e.contato.codigoTipoContato == 2);

          this.formulario.patchValue({
            contato: {
              telefoneFixo: telefoneObj.length > 0 ? telefoneObj[0].contato.descricao : '',
              celular: celularObj.length > 0 ? celularObj[0].contato.descricao : '',
              email: emailObj.length > 0 ? emailObj[0].contato.descricao : ''
            }
          });
        }

      });


  }

  listaDocumentos() {
    this.clienteDocumentoService.get<ClienteDocumento[]>(this.codigo)
      .subscribe(result => {
        this.clienteDocumentos = result;
        if (result.length > 0) {
          var RgObj = this.clienteDocumentos.filter(e => e.Documento.codigoTipoDocumento == 1);
          var CpfObj = this.clienteDocumentos.filter(e => e.Documento.codigoTipoDocumento == 2);

          this.formulario.get('documento.rg').setValue(RgObj.length > 0 ? RgObj[0].Documento.descricao : null);
          this.formulario.get('documento.cpf').setValue(CpfObj.length > 0 ? CpfObj[0].Documento.descricao : null);

        }

      });
  }
  resetMunicipio() {
    this.formulario.get('endereco.municipio').reset();

  }
  criarObjetoEndereco() {
    this.endereco = <Endereco>{
      codigo: 0,
      codigoTipoEndereco: 1,
      codigoUnidadeFederativa: 0,
      codigoMunicipio: 0,
      codigoSituacao: 1,
      descricao: null,
      numero: null,
      complemento: null,
      bairro: null,
      cep: 0,
      dataCadastro: new Date(),
      codigoUsuarioCadastrado: 1,
      dataAlteracao: null,
      codigoUsuarioAlteracao: null
    };
  }

  valoresNulosEndereco() {
    var camposEndereco: Array<string> = [
      "endereco.numero",
      "endereco.bairro",
      "endereco.cep",
      "endereco.complemento",
      "endereco.estado",
      "endereco.municipio",
      "endereco.rua",
    ];

    return FormValidations.validaTodosControlesNulosOuVazios(camposEndereco, this.formulario);
  }

  quantidadesNulosContatos() {

    var camposContatos: Array<string> = ["contato.telefoneFixo",
      "contato.celular",
      "contato.email"
    ];
    return FormValidations.quantidadeControlesNulos(camposContatos, this.formulario);
  }

  quantidadeNulosDocumentos() {
    var camposContatos: Array<string> = ["documento.rg", "documento.cpf"];
    return FormValidations.quantidadeControlesNulos(camposContatos, this.formulario);
  }

  excluirClienteContato_Contato(clienteContato: ClienteContato) {
    this.clienteContatoService
      .excluir(clienteContato.codigoCliente, clienteContato.codigoContato).pipe(
        map(sucesso => sucesso ? this.contatoService.delete(clienteContato.codigoContato).subscribe() : EMPTY)
      ).subscribe();
  }

  excluirClienteDocumento_Documentos(clienteDocumento: ClienteDocumento) {
    this.clienteDocumentoService.excluir(clienteDocumento)
      .pipe(
        map(sucesso => sucesso ? this.documentoService.delete(clienteDocumento.codigoDocumento) : EMPTY)).subscribe();
  }

  openConfirmExclusao() {
    this.serviceAlert.openConfirmModal('Tem certeza que deseja excluir?', 'Excluir - Cliente', (answer: boolean) => {
      if (answer) {
        this.exclusaoCliente();

      }
    }, "Sim", "Não"
    );
  }

  exclusaoCliente(){

    var msgSucess : string = 'Registro excluído com sucesso!';
    var msgErro : string  = 'Ocorreu um erro na tentativa de exclusão  do cliente.'
    //contatos
    this.clienteContatos.forEach(element=>{
      this.excluirClienteContato_Contato(element);
    })

    //documentos
    this.clienteDocumentos.forEach(element=>{
      this.excluirClienteDocumento_Documentos(element);
    })

    //clientes - endereco
    if (this.clienteEnderecos.length >0 ){
      this.clienteEnderecoService.excluirTodos(this.clienteEnderecos);
    }

    //endereco
    if(this.endereco !== undefined && this.endereco.codigo > 0){
      this.enderecoService.delete(this.endereco.codigo).subscribe();
    }


    this.clienteService.delete(this.codigo).subscribe(sucesso=>{
      this.handlerSuccess(msgSucess);
      setTimeout(() => { this.retornar(); }, 3000);
    }, error=>
    {
      console.log(error);
      this.handleError(msgErro);
    });

  }
  openDialogFormaPagto(){
    const dialogRef = this.dialog.open(ClienteFormaPagamentoComponent,
      { width: '800px' ,
       height: '600px;',
       data : { codigo: this.codigo, codigoUsuario : this.codigoLogin} }
    );
  }
}
function _serviceAlert(_serviceAlert: any) {
  throw new Error('Function not implemented.');
}

