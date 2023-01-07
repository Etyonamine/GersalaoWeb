import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { of, Subscription } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { AgendaServico } from 'src/app/agenda-servicos/agenda-servico';
import { AgendaServicoEdit } from 'src/app/agenda-servicos/agenda-servico-edit/agenda-servico-edit';
import { AgendaServicoEditComponent } from 'src/app/agenda-servicos/agenda-servico-edit/agenda-servico-edit.component';
import { AgendaServicosService } from 'src/app/agenda-servicos/agenda-servicos.service';
import { AuthService } from 'src/app/auth-guard/auth.service';
import { ClienteService } from 'src/app/cliente/cliente.service';
import { ClienteViewModel } from 'src/app/cliente/clienteViewModel';
import { EmpresaService } from 'src/app/empresa/empresa.service';
import { Profissional } from 'src/app/profissional/professional';
import { ProfissionalService } from 'src/app/profissional/profissional.service';
import { Servico } from 'src/app/servico/servico';
import { ServicoModule } from 'src/app/servico/servico.module';
import { ServicosService } from 'src/app/servico/servicos.service';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { BaseFormComponent } from 'src/app/shared/base-form/base-form.component';
import { Agenda } from '../agenda';
import { AgendaGravarNovo } from '../agenda-gravar-novo';
import { AgendaIn } from '../agenda-in';
import { AgendaService } from '../agenda.service';
import { AgendaServicoAdd } from './agenda-servico-add';

@Component({
  selector: 'app-agenda-form',
  templateUrl: './agenda-form.component.html',
  styleUrls: ['./agenda-form.component.scss']
})
export class AgendaFormComponent extends BaseFormComponent implements OnInit, OnDestroy {
  formulario: FormGroup;
  formServicos: FormGroup;
  agenda: Agenda;
  dataSelecionada: Date | null;
  tomorrow:Date;
  horaInicioDefault: string;
  horaFimDefault: string;
  codigoUsuario: number; 
  valorTotalServico: number;
  codigoClente :number;

  edicao: boolean;

  optionProfissional: Array<Profissional>=[];  
  optionServicos: Array<Servico>=[];  
  optionClientes: ClienteViewModel[];
  tituloPagina: string;

  inscricaoAgenda$: Subscription;
  inscricaoAgendaValidar$: Subscription;
  inscricaoProfissional$: Subscription;
  inscricaoServico$: Subscription;
  inscricaoClientes$: Subscription;
  inscricaoEmpresa$: Subscription;
  inscricaoValidacao$ : Subscription;
  inscricaoAgendaServicoConsultar$:Subscription;

  listaServicosTabela : Array<AgendaServicoAdd>=[];


//manipulacao da tabela
displayedColumns: string[] = ['select', 'item', 'nomeProfissional', 'nomeServico', 'valorServico','descricaoSituacao','observacao', 'action'];
dataSource = new MatTableDataSource<AgendaServicoAdd>(this.listaServicosTabela);
selection = new SelectionModel<AgendaServicoAdd>(true, []);

/** Whether the number of selected elements matches the total number of rows. */
isAllSelected() {
  const numSelected = this.selection.selected.length;
  const numRows = this.dataSource.data.length;
  return numSelected === numRows;
}

/** Selects all rows if they are not all selected; otherwise clear selection. */
masterToggle() {
  if (this.isAllSelected()) {
    this.selection.clear();
    return;
  }

  this.selection.select(...this.dataSource.data);
}

/** The label for the checkbox on the passed row */
checkboxLabel(row?: AgendaServicoAdd): string {
  if (!row) {
    return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
  }
  return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.item + 1}`;
}


  allComplete: boolean = false;


  constructor(private formBuilder: FormBuilder, 
    private alertService: AlertService,
    private profissionalService: ProfissionalService,
    private servicoService: ServicosService,
    private clienteService: ClienteService,
    private empresaService: EmpresaService,
    private authService : AuthService,
    private agendaService: AgendaService,
    private agendaServicoService: AgendaServicosService,
    private route: ActivatedRoute,
    public dialog: MatDialog,) {
    super();
  }

  submit() {
    let valueSubmit = Object.assign({}, this.formulario.value);
    let dataAgenda = this.formulario.get("dataAgenda").value;     
    let horaInicio = this.formulario.get('horaInicio').value;
    let horaFim = this.formulario.get('horaFim').value;
    let codigoClienteSelecionado = valueSubmit.codigoCliente; 
    let observacaoCliente = this.formulario.get('observacaoCliente').value;

    let servicosGravar : Array<AgendaServico>=[];

    this.listaServicosTabela.forEach(serv =>{
      if (serv.codigoAgenda > 0 ){
        servicosGravar.push(serv.agendaServico);
      }else{
        servicosGravar.push({ 
          codigoAgenda: serv.codigoAgenda,     
          codigoCliente:codigoClienteSelecionado,
          codigoProfissional:serv.codigoProfissional,
          codigoServico: serv.codigoServico,
          codigoSituacao: serv.codigoSituacao,         
          dataAgenda: dataAgenda,
          observacao: serv.observacao
        } as AgendaServico)
      }      
    });

    let agendaIn = {
      Data : dataAgenda,
      HoraInicio : horaInicio,
      HoraFim: horaFim,
      CodigoCliente: codigoClienteSelecionado,
      Servicos:servicosGravar
    } as AgendaIn;
   
    this.alertService.openConfirmModal('Por favor, confirmar se deseja continuar com o agendamento?', 'Agendar - Cliente', (resposta: boolean) => {
      if (resposta) {
          if (!this.edicao) {
                //validação das informações para agendamento.
                this.inscricaoValidacao$ = this.agendaService.validarInfoAgendamento(agendaIn)
                                                              .pipe(
                                                                concatMap(              
                                                                  result=>{

                                                                  let retorno:Boolean = false;              
                                                                  if (result){
                                                                    retorno = result.valido;
                                                                    if(!retorno){
                                                                      this.handleError(result.mensagem);                                                            
                                                                    }                
                                                                  }               
                                                                  return of(retorno);
                                                                })           
                                                              )
                                                                .subscribe(retorno=>{
                                                                  if (retorno){                
                                                                    //montando as informaçoes para gravar
                                                                    var agendaGravar={
                                                                      CodigoCliente : agendaIn.CodigoCliente,
                                                                      CodigoUsuarioCadastro : this.codigoUsuario,
                                                                      Data: agendaIn.Data,
                                                                      HoraInicio: agendaIn.HoraInicio,
                                                                      HoraFim : agendaIn.HoraFim,
                                                                      NumeroComanda : 0,
                                                                      Observacao : observacaoCliente,
                                                                      Servicos : agendaIn.Servicos
                                                                    } as AgendaGravarNovo; 
                                                                    //gravar as informaçoes do agendamento.
                                                                    this.inscricaoAgenda$ = this.agendaService.salvarNovoRegistro(agendaGravar)
                                                                                                              .subscribe(resultado=>{
                                                                                                                if(resultado){
                                                                                                                  this.handlerSucesso('Agendamento gravado com sucesso!');                                                              
                                                                                                                  this.limparCampos();
                                                                                                                }
                                                                                                              }, error=>{
                                                                                                                console.log(error);
                                                                                                                this.handleError('Ocorreu algum erro na tentativa de salvar o agendamento.');
                                                                                                              });
                                                                  }
                                                                },
                                                                error=>{                                                          
                                                                    console.log(error);
                                                                    this.handleError("Ocorreu um erro ao tentar validar a hora inicial.");
                                                                });
          }else{
           
            this.agenda.listarServicos = servicosGravar;
            this.agenda.codigoUsuarioAlteracao = this.codigoUsuario;

            this.inscricaoAgenda$=this.agendaService.atualizarRegistro(this.agenda)
                                                    .subscribe(result=>{
                                                      if(result){
                                                        this.handlerSucesso('Agenda atualizada com sucesso!');
                                                      }else{
                                                        this.handlerExclamacao('Não foi atualizado com sucesso a agenda.');
                                                      }
                                                    },error=>{
                                                      console.log(error);
                                                      this.handleError('Ocorreu um erro ao tentar salvar o registro');
                                                    })
          }
          
      }}, 'Sim', 'Não'
    );
  }
  ngOnInit(): void {
    
    this.agenda = this.route.snapshot.data['agenda'];
    this.edicao = this.agenda==undefined? false:true;
    this.tituloPagina = this.edicao?"Agenda - Serviço - Editando":"Agenda - Serviço - Novo Registro";
    this.codigoClente = this.agenda!=undefined? this.agenda.codigoCliente:null;
    this.criacaoFormulario();
    this.listarProfissionais();
    this.listaCliente(); 
    
    this.tomorrow = new Date();    
    this.valorTotalServico =0 ;
    this.optionProfissional = [];
    this.optionServicos = [];
    this.optionClientes = []; 
    this.codigoUsuario =  Number.parseInt(this.authService.usuarioLogado.codigo);
    this.dataSelecionada = this.agenda != undefined ? this.agenda.dataInicio: new Date();
    this.recuperarDadosEmpresa();
    this.preenchimentoServicos();
    
    
    
  }
  ngOnDestroy():void {
    if (this.inscricaoProfissional$){
      this.inscricaoProfissional$.unsubscribe();      
    }
    if (this.inscricaoServico$){
      this.inscricaoServico$.unsubscribe();
    }
    if (this.inscricaoClientes$){
      this.inscricaoClientes$.unsubscribe();
    }
    if (this.inscricaoEmpresa$){
      this.inscricaoEmpresa$.unsubscribe();
    }
    if (this.inscricaoAgenda$){
      this.inscricaoAgenda$.unsubscribe();
    }
    if (this.inscricaoAgendaValidar$){
      this.inscricaoAgendaValidar$.unsubscribe();
    }
    if (this.inscricaoValidacao$){
      this.inscricaoValidacao$.unsubscribe();
    }    
    if (this.inscricaoAgendaServicoConsultar$){
      this.inscricaoAgendaServicoConsultar$.unsubscribe();
    }
  }  
  criacaoFormulario(){ 

    let dataHoraInicial = this.agenda !=undefined? this.agenda.dataInicio.toString() : null;
    let dataHoraFinal = this.agenda !=undefined? this.agenda.dataFim.toString(): null;

    //formulario cliente
    this.formulario = this.formBuilder.group({          
      dataAgenda: [{value:this.agenda !=undefined? dataHoraInicial.substring(0,10): new Date(),disabled : this.edicao},Validators.required],  
      horaInicio: [{value : dataHoraInicial == undefined?null: dataHoraInicial.substring(11,16),disabled : this.edicao},Validators.required] ,      
      horaFim: [{value:dataHoraFinal == undefined?null:dataHoraFinal.substring(11,16),disabled : this.edicao},Validators.required] ,      
      codigoProfissional:[null],
      codigoServico: [null ],       
      codigoCliente: [this.codigoClente, Validators.required],
      valorServico: [0],
      observacao: [null],
      observacaoCliente: [this.agenda !=undefined? this.agenda.observacao:null],
      descricaoSituacao: [{value: this.agenda !=undefined? "Agendado":"Novo",disabled : true}]
      
    });    
  }  
  handlerSucesso(mensagem:string)
  {
    this.alertService.mensagemSucesso(mensagem);
  }
  handleError(mensagem:string)
  {
    this.alertService.mensagemErro(mensagem);
  }
  listarProfissionais(){
    this.inscricaoProfissional$ = this.profissionalService.ListarProfissionais()
                                                          .subscribe(result=>{
                                                            if (result){
                                                              result.forEach(profi=>{
                                                                this.optionProfissional.push({
                                                                  codigo : Number.parseInt(atob(profi.codigo)),
                                                                  nome : atob(profi.nome),
                                                                  valorComissao : Number.parseFloat(atob(profi.valorComissaoPercentual).replace(',','.')),
                                                                  codigoTipoServico : Number.parseInt(atob(profi.tipoServico.codigo))
                                                                }as Profissional);
                                                              })
                                                            }
                                                            
                                                          },
                                                          error=>{
                                                            console.log(error);
                                                            this.handleError('Ocorreu um erro ao listar os Profissionais.');
                                                          })
  }
  listaServicos(event){
    let objProfissional= this.optionProfissional.find(x=>x.codigo === this.formulario.get('codigoProfissional').value) ;
    
    if (this.optionServicos.length>0){
      this.optionServicos.splice(0,this.optionServicos.length);  
    }
    
    if (objProfissional!== null){
      //pesquisando no serviço pelo tipo
      this.inscricaoServico$ = this.servicoService.listarServicoPorTipo(objProfissional.codigoTipoServico.toString())
                                                  .subscribe(result=>{
                                                    if (result){                                                      
                                                        result.forEach(servico =>{
                                                          this.optionServicos.push({
                                                            codigo : Number.parseInt(atob(servico.codigo)),
                                                            descricao : atob(servico.descricao),
                                                            valor : Number.parseFloat(atob(servico.valor).replace(',','.')),
                                                            valorComissaoPercentual: Number.parseFloat(atob(servico.valorComissao).replace(',','.'))
                                                        } as Servico)
                                                        });                                                      
                                                    }                                                    
                                                  })
    }

    //this.inscricaoServico$ = this.servicoService.
  }
  listaCliente(){
    this.optionClientes = null;

    this.inscricaoClientes$ = this.clienteService.listaClientes()
                                                .subscribe(result=>{
                                                  if (result){
                                                    this.optionClientes = this.clienteService.ConverterListaCriptografadaCliente(result);
                                                    
                                                  }                                                     
                                                },
                                                error=>{
                                                  console.log(error);
                                                  this.handleError('Ocorreu um erro ao listar os clientes.');
                                                })
  }
  recuperarDadosEmpresa(){
    this.inscricaoEmpresa$ = this.empresaService.recuperarDadosEmpresa().subscribe(result=>{
      
      this.horaInicioDefault = atob(result.horaInicial).substring(0,5);
      this.horaFimDefault = atob(result.horaFim).substring(0,5);
      console.log(this.horaInicioDefault);
      console.log(this.horaFimDefault);

    });
  } 
  handlerExclamacao(mensagem:string){
    this.alertService.mensagemExclamation(mensagem);
  }
  limparCampos(){
    this.formulario.reset();
    this.formulario.controls['descricaoSituacao'].setValue('Novo');
    this.listaServicosTabela.splice(0,this.listaServicosTabela.length); 
    this.selection.clear;
    this.dataSource.data = this.listaServicosTabela;
    

  }
  adicionarNaLista(){
    //validacao    
    //profissional
    if (this.formulario.get("codigoProfissional").value == 0 ||
             this.formulario.get("codigoProfissional").value == null){
      this.handlerExclamacao("Por favor, selecionar um profissional!");
      return false;
    }
    let codigoProfi = this.formulario.get("codigoProfissional").value;

    //servico
    if (this.formulario.get("codigoServico").value == 0 ||
             this.formulario.get("codigoServico").value == null){
      this.handlerExclamacao("Por favor, selecionar um serviço!");
      return false;
    }
    let codigoServi =this.formulario.get("codigoServico").value;
    if (this.listaServicosTabela.length>0){
      let servico = this.listaServicosTabela.find(x=>x.codigoProfissional == codigoProfi && x.codigoServico == codigoServi );
      if (servico !== undefined ){
        this.handlerExclamacao('Atenção!Já existe na lista este serviço.');
        return false;
      }
    }
    let nomeProfissionalSelecionado = this.optionProfissional.find(x=>x.codigo == codigoProfi).nome;
    let nomeServicoSelecionado = this.optionServicos.find(x=>x.codigo == codigoServi).descricao;
    let descSituacaoServico : string = "Adicionado";
    let codigoSituacaoServi : number = 99;
    let valorServicoSelecionado :number = this.formulario.get("valorServico").value;

    this.listaServicosTabela.push({
      codigoAgenda : 0 ,
      item : this.listaServicosTabela.length ==0 ? 1 : (this.listaServicosTabela.length + 1),
      codigoProfissional : codigoProfi, 
      codigoServico : codigoServi,
      nomeProfissional : nomeProfissionalSelecionado, 
      nomeServico : nomeServicoSelecionado,
      observacao : this.formulario.get("observacao").value,
      codigoSituacao : codigoSituacaoServi, 
      descricaoSituacao :  descSituacaoServico, 
      valorServico : valorServicoSelecionado
    } as AgendaServicoAdd);

    this.dataSource.data = this.listaServicosTabela;
    
    this.valorTotalServico = (this.valorTotalServico + Number.parseFloat(valorServicoSelecionado.toString()));
    this.handlerSucesso('Serviço adicionado com sucesso!');
    this.limparCamposServicos();
  }  
  recuperarValorServico(){
    let valorEncontrado : number = 0;
   
    let codigoServicoSel = this.formulario.get("codigoServico").value ;
    if(codigoServicoSel!== null || codigoServicoSel!== undefined ){
      valorEncontrado = this.optionServicos.find(x=>x.codigo == codigoServicoSel).valor;
      this.formulario.controls["valorServico"].setValue(valorEncontrado.toFixed(2));
    }
  }
  limparCamposServicos(){
    this.formulario.controls["codigoServico"].setValue(0);
    this.formulario.controls["observacao"].setValue(null);
    this.formulario.controls["valorServico"].setValue(0);

  }
  removerLista(){            
    this.alertService.openConfirmModal('Por favor, confirmar se deseja remover os itens selecionados da lista de serviços?', 'Agendar - Cliente', (resposta: boolean) => {
      if (resposta) {
        let rows : number = 1;
        let countRemove:number=0;
        this.selection.selected.forEach(itemrem=>{
          if (itemrem.codigoSituacao == 99 ){
            let index = this.listaServicosTabela.findIndex(x=>x.item = itemrem.item);
            let valorSelecionado = Number.parseFloat(itemrem.valorServico.toString());
            this.listaServicosTabela.splice(index,1);                        
            this.valorTotalServico = (this.valorTotalServico - valorSelecionado);
            countRemove++;
          }else{
            this.handlerExclamacao('Este serviço está agendado não poderá ser removido! Por favor, faça o cancelamento.');
          }                    
        });
        if (countRemove>0){
          this.handlerSucesso('removido da lista com sucesso!');
          this.dataSource.data = this.listaServicosTabela;
          this.selection.clear();
          this.isAllSelected() ;
        } 
      }

    }, 'Sim', 'Não');
  }  
  preenchimentoServicos()
  {
    if (this.agenda ==undefined ){
      return;
    }
    let lista = this.agenda.listarServicos;
    lista.forEach(servico=>{     
      
      this.listaServicosTabela.push(
        {
          codigoAgenda : this.agenda.codigo,
          item : this.listaServicosTabela.length ==0 ? 1 : (this.listaServicosTabela.length + 1),
          codigoProfissional : servico.codigoProfissional, 
          codigoServico : servico.codigoServico,
          nomeProfissional : servico.profissional.nome, 
          nomeServico : servico.servico.descricao,
          observacao : servico.observacao,          
          descricaoSituacao : servico.situacao.descricao,
          valorServico : servico.valorServico,
          agendaServico: servico          
        }as AgendaServicoAdd
      );
      
    });    
  }
  openDialogEditarServico(servico: AgendaServico ){
    if(servico==undefined){
      return;
    }
    let agendaServicoEdit ={
      codigoAgenda: servico.codigoAgenda,
      codigoProfissional: servico.codigoProfissional,
      codigoServico: servico.codigoServico,
      codigoUsuarioAlteracao: this.codigoUsuario,
      descricaoServico: servico.servico.descricao,
      descricaoSituacao: servico.situacao.descricao,
      observacao: servico.observacao,
      valorServico: servico.valorServico,
      nomeProfissional:servico.profissional.nome      
    } as AgendaServicoEdit;

     // montando o dialogo
     const dialogRef = this.dialog.open(AgendaServicoEditComponent,
      {width: '700px' , height: '900px;',
        data : agendaServicoEdit               
      }
    );
    dialogRef.afterClosed().subscribe(result => {

      let indexObserv = this.listaServicosTabela.findIndex(x=>x.codigoServico == agendaServicoEdit.codigoServico && x.codigoProfissional== agendaServicoEdit.codigoProfissional);
      let indexAgendasrvObs = this.agenda.listarServicos.findIndex(x=>x.codigoServico == agendaServicoEdit.codigoServico && x.codigoProfissional== agendaServicoEdit.codigoProfissional);

      if(result!== undefined){
        this.listaServicosTabela[indexObserv].observacao = result.toString().trim();
        this.agenda.listarServicos[indexAgendasrvObs].observacao= result.toString().trim();

      }else{
        let servicoRecuperado : AgendaServico ;
        this.inscricaoAgendaServicoConsultar$= this.agendaServicoService.recuperarServico(servico)
                                                                        .subscribe(resultadoConsulta=>{
                                                                          servicoRecuperado  = resultadoConsulta;
                                                                          this.listaServicosTabela[indexObserv].observacao = servicoRecuperado.observacao.toString().trim();
                                                                          this.agenda.listarServicos[indexAgendasrvObs].observacao= servicoRecuperado.observacao.toString().trim();
                                                                        });
      }    
       
    });
  }
}
