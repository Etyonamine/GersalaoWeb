import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AgendaServico } from '../agenda-servicos/agenda-servico';
import { AuthService } from '../auth-guard/auth.service';
import { Empresa } from '../empresa/empresa';
import { EmpresaService } from '../empresa/empresa.service';
import { Profissional } from '../profissional/professional';
import { ProfissionalService } from '../profissional/profissional.service';
import { AlertService } from '../shared/alert/alert.service';
import { Usuario } from '../usuario/usuario';
import { UsuarioService } from '../usuario/usuario.service';
import { Agenda } from './agenda';
import { AgendaBaixa } from './agenda-baixa';
import { AgendaService } from './agenda.service';

export interface AgendaDia{
  codigoProfissional:number;
  listaAgenda: Array<Agenda>; 
}
@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.scss']
})
export class AgendaComponent implements OnInit {
  codigoUsuario: number;
  selected: Date | null;
  empresa: Empresa;
  horarios: Array<string> = ["08:00", "08:30", "09:00", "09:30"];
  
  usuarios : Usuario[];

  listaProfissionais: Array<Profissional>=[];
  listaAgenda: Array<Agenda>=[];
  listaServicos: Array<AgendaServico>=[];
  qtdeColunasProfissionais: number;
  qtdeAgendas : number;

  listaLinksAgenda:Array<string>=[];
  listaAgendasDia: Array<AgendaDia>=[];

  inscricaoAngenda$: Subscription;
  inscricaoEmpresa$: Subscription;
  inscricaoProfissional$: Subscription;
  inscricaoUsuario$: Subscription;

  constructor(
    private agendaService: AgendaService,
    private empresaService: EmpresaService,
    private profissionalService: ProfissionalService,
    private authService:AuthService,
    private alertService: AlertService,
    public dialog: MatDialog ,
    private usuarioService: UsuarioService  ,
    private router: Router 
    ) {
  }

  ngOnInit(): void {
   
    this.selected =  new Date();
    this.recuperarDadosEmpresa();
    this.empresa = {} as Empresa;
    this.obterProfissionais();
    this.qtdeColunasProfissionais = 1;
    this.qtdeAgendas = 0;
    this.obterAgendas();
    this.codigoUsuario = Number.parseInt(this.authService.usuarioLogado.codigo);
    //this.listarUsuarios();
  }
  ngOnDestroy(): void {
    if (this.inscricaoEmpresa$) {
      this.inscricaoEmpresa$.unsubscribe();
    }
    if (this.inscricaoProfissional$) {
      this.inscricaoProfissional$.unsubscribe();
    }
    if (this.inscricaoAngenda$){
      this.inscricaoAngenda$.unsubscribe();
    }
    if (this.inscricaoUsuario$){
      this.inscricaoUsuario$.unsubscribe();
    }
  }
  obterProfissionais() {

    this.inscricaoProfissional$ = this.profissionalService.ListarProfissionais()
      .subscribe(result => {
        
        result.forEach(profi => {
          this.listaProfissionais.push({
            codigo: Number.parseInt(atob(profi.codigo)),
            nome: atob(profi.nome)         
          } as Profissional);

          if (result.length > 0 ){
            this.montarAgendaDia();
            this.qtdeColunasProfissionais = result.length;
          }
          
        }, error => {
          console.log(error);
          this.handleError('Ocorreu um erro ao recuperar a lista de profissionais.');
        });
        if (result){
          this.qtdeColunasProfissionais = result.length;
        }
      });
  }
  obterAgendas(){
    //let sortColumn: string = 'nomeProfissional';
    //let dataAgenda = this.selected.toJSON().substring(0,10);   
    let dataAgenda = this.selected;                                              
    this.inscricaoAngenda$ = this.agendaService.obterAgendaPorDia(dataAgenda.toDateString())
                                               .subscribe(result=>{
                                                  this.listaAgenda =  result;                                                  
                                                  this.qtdeAgendas = 1;
                                                  this.montarAgendaDia();
                                               },error=>{
                                                console.log(error);
                                                this.handleError('ocorreum erro ao tentar recuperar as agendas!');
                                               });
  }
  recuperarDadosEmpresa() {
        this.inscricaoEmpresa$ = this.empresaService.recuperarDadosEmpresa()
          .subscribe(result => {
            this.empresa.codigo = atob(result.codigo);
            this.empresa.horaInicial = atob(result.horaInicial);
            this.empresa.horaFim = atob(result.horaFim);
            this.empresa.quantidadeMinutosServico = atob(result.quantidadeMinutosServico);
          }, error => {
            console.log(error);
          });
      }
  handlerSucesso(mensagem: string) {
        this.alertService.mensagemSucesso(mensagem);
      }
  handleError(mensagem: string) {
        this.alertService.mensagemErro(mensagem);
      }
  montarAgendaDia(){
    //limpando a lista
    this.listaAgendasDia.splice(0,this.qtdeColunasProfissionais); 

    let cssHora : Array<String> = ["hora_agendada_pendente", "hora_agendada_concluido", "hora_agendada_cancelado"];

    /* this.listaLinksAgenda = ['Nenhum agendamento','Nenhum agendamento', 'Nenhum agendamento'];  */    

     let strLinks : string;          
     let contadorAgenda: number;
     
     //montando
     if (this.qtdeAgendas > 0 && this.listaAgenda.length > 0  ){
      

       //percorrendo a lista de profissionais
        this.listaProfissionais.forEach(profi=>{  
          let agendas: Array<Agenda>=[];
          this.listaAgenda.forEach(agenda=>{
            if (agenda.listarServicos.find(x=>x.codigoProfissional== profi.codigo)){          
              agenda.css=cssHora[0];
              agendas.push(agenda);
                        }
          });                          
          agendas.sort(function(a,b){return new Date(a.dataInicio).getDate() - new Date(b.dataInicio).getDate()});
          
          this.listaAgendasDia.push({codigoProfissional : profi.codigo, listaAgenda : agendas });
                                  
      });
    }      
  }
  listarUsuarios(){
    this.inscricaoUsuario$ = this.usuarioService.listarTodos()
                                                .subscribe(result=>{
                                                  this.usuarios = result;
                                                },error=>{
                                                  console.log(error);
                                                  this.handleError('Ocorreu o erro ao tentar recuperar a lista de usuarios.');
                                                })    
  }
}


