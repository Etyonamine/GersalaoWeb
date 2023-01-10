import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { AgendaServico } from 'src/app/agenda-servicos/agenda-servico';
import { AgendaServicosService } from 'src/app/agenda-servicos/agenda-servicos.service';
import { MotivoCancelamentoServico } from 'src/app/motivo-cancelamento-servico/motivo-cancelamento-servico';
import { MotivoCancelamentoServicoService } from 'src/app/motivo-cancelamento-servico/motivo-cancelamento-servico.service';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { BaseFormComponent } from 'src/app/shared/base-form/base-form.component';
import { AgendaCancelar } from '../agenda-cancelar';
import { AgendaServicoAdd } from '../agenda-form/agenda-servico-add';
import { AgendaServicoCancelarGravar } from './agenda-servico-cancelar-gravar';
import { AgendaServicoProfissional } from './agendaServicoProfissional';

@Component({
  selector: 'app-agenda-cancelamento',
  templateUrl: './agenda-cancelamento.component.html',
  styleUrls: ['./agenda-cancelamento.component.scss']
})
export class AgendaCancelamentoComponent extends BaseFormComponent implements OnInit {

  formulario: FormGroup;  
  agenda: AgendaCancelar;

  //manipulacao da tabela
  displayedColumns: string[] = ['item','nomeProfissional', 'nomeServico', 'valorServico','observacao'];
  dataSource = new MatTableDataSource<AgendaServicoAdd>();

  statusCancelamento: boolean;
  descricaoSituacao: string;
  inscricaoCancelar$: Subscription;

  dataAgenda: Date;  
  dataInicioParam : string;
  dataFimParam : string;

  listaMotivosCancelamento: MotivoCancelamentoServico[];
  

  inscricao$: Subscription;

  constructor(
              @Inject(MAT_DIALOG_DATA)
              public data: AgendaCancelar, 
              private formBuilder: FormBuilder,
              private motivoCancelamentoServicoService:MotivoCancelamentoServicoService,
              private agendaServicoService: AgendaServicosService,
              private alertService: AlertService,
              private dialogRef: MatDialogRef<AgendaCancelamentoComponent>) { super(); }

  ngOnInit(): void {
    this.agenda = this.data;
    this.dataInicioParam = this.agenda.dataInicio.toString().substring(8,10) + '/' + this.agenda.dataInicio.toString().substring(5,7) +'/'+ this.agenda.dataInicio.toString().substring(0,4) + ' ' + this.agenda.dataInicio.toString().substring(11,19);
    this.dataFimParam = this.agenda.dataFim.toString().substring(8,10) + '/' + this.agenda.dataFim.toString().substring(5,7) +'/'+ this.agenda.dataFim.toString().substring(0,4)+ ' ' + this.agenda.dataFim.toString().substring(11,19);
    this.dataSource.data=this.agenda.listaServicos;
    this.listarMotivos();
    this.criarFormulario();
    
    
  }
  ngOnDestroy():void{
    if(this.inscricaoCancelar$){
      this.inscricaoCancelar$.unsubscribe();
    }
    if(this.inscricao$){
      this.inscricao$.unsubscribe();
    }
  }  
  listarMotivos(){
    this.inscricao$ = this.motivoCancelamentoServicoService.Listar()
                                                           .subscribe(result=>{
                                                              this.listaMotivosCancelamento = result;
                                                           },error=>{
                                                            console.log(error);
                                                            this.handleError('Ocorreu um erro ao tentar recuperar os motivos de cancelamento.');
                                                           }); 
  }
  criarFormulario(){
    //formulario 
    this.formulario = this.formBuilder.group({
      nomeCliente:[this.agenda.campoNomeCliente],  
      dataInicio: [this.dataInicioParam],
      dataFim: [this.dataFimParam],
      codigoMotivoCancelamento:[this.agenda.codigoMotivoCancelamento, Validators.required],
      descricaoMotivoCancelamento: this.agenda.descricaoMotivoCancelamento      
    });
  }
  handlerSucesso(mensagem: string) {
    this.alertService.mensagemSucesso(mensagem);
  }
  handleError(mensagem: string) {
    this.alertService.mensagemErro(mensagem);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }  
  submit() {
  
    if (this.formulario.get('codigoMotivoCancelamento').value ==6 && this.formulario.get('descricaoMotivoCancelamento').value==undefined){
      this.handleError('Por favor, informe a descrição do motivo de cancelamento');
      return;
    }
    let agendaCancelar = this.agenda;
    
    this.alertService.openConfirmModal('Por favor, confirmar se deseja continuar com o cancelamento da agendamento?', 'Cancelar - Agendamento', (resposta: boolean) => {
      if (resposta) {

        //coletando informações para cancelar
         let listaServicosGravar : Array<AgendaServicoProfissional> = [];

         this.agenda.listaServicos.forEach(servico=>{
                                                      listaServicosGravar.push({
                                                                                      codigoProfissional : servico.codigoProfissional,
                                                                                      codigoServico  : servico.codigoServico
                                                                                      } as AgendaServicoProfissional);
                                                    }
                                          );
          let agendaCancelarGravar = {
                                       codigoAgenda: this.agenda.codigoAgenda,
                                       codigoUsuarioCancelamento: this.agenda.codigoUsuarioCancelamento,
                                       listaServicosIn: listaServicosGravar
                                     } as AgendaServicoCancelarGravar;                                                    

          //agendaCancelar.dataCancelamento 
          this.inscricaoCancelar$= this.agendaServicoService.cancelarServicos(agendaCancelarGravar)
                                                    .subscribe(result=>{
                                                      if(result){
                                                        this.handlerSucesso('Serviço(s) cancelado(s) com sucesso!');                                                       
                                                      }
                                                    },
                                                    error=>{
                                                      console.log(error);
                                                      this.handleError('Ocorreu um erro ao tentar cancelar o agendamento.');
                                                    });
          }
        }, 'Sim', 'Não'
    );
  }
}

