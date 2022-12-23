import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EMPTY, Subscription } from 'rxjs';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { ClienteFormaPagamento } from './cliente-forma-pagamento';
import { ClienteFormaPagamentoDialog } from './cliente-forma-pagamento-dialog';
import { ClienteFormaPagamentoService } from './cliente-forma-pagamento.service';
import { ClienteformapagamentodialogoComponent } from './clienteformapagamentodialogo/clienteformapagamentodialogo.component';

@Component({
  selector: 'app-cliente-forma-pagamento',
  templateUrl: './cliente-forma-pagamento.component.html',
  styleUrls: ['./cliente-forma-pagamento.component.scss']
})
export class ClienteFormaPagamentoComponent implements OnInit {
  public colunas: string[]=["tipo","descricao","acao"];
  titulo: string;
  habilitaNovo: boolean;
  clienteFormasPagto: Array<ClienteFormaPagamento>;
  
  inscricaoClienteFormaPagto$: Subscription;

  constructor(private clienteFormaPagamentoService: ClienteFormaPagamentoService,
              private serviceAlert:AlertService,
              public dialog: MatDialog ,
              private alertService:AlertService,
              @Inject(MAT_DIALOG_DATA) public data: ClienteFormaPagamentoDialog) { }

  ngOnInit(): void {
    this.loadData();
  }
  ngOnDestroy(): void{
    if (this.inscricaoClienteFormaPagto$){
      this.inscricaoClienteFormaPagto$.unsubscribe();
    }
  }
  loadData(query: string = null) {
    this.habilitaNovo = false;
    
       this.inscricaoClienteFormaPagto$ =  this.clienteFormaPagamentoService.get<ClienteFormaPagamento[]>(this.data.codigo
      ).subscribe(result => {
                            this.clienteFormasPagto = result;
                            if (result) {
                              this.habilitaNovo = result.length === 3 ? false : true;
                            }
                            else{
                              this.habilitaNovo = true;
                            }
      }, error => {
        console.error(error);
        this.handleError('');
        {
          return EMPTY;
        }

      });
    
  }
  handleError(msg: string) {
    this.serviceAlert.mensagemErro(msg);
  }
  handlerSuccess(msg: string) {
    this.serviceAlert.mensagemSucesso(msg);
  }
  openDialogNovo()
  {
    const novoClienteFormaPagto = {
      codigoCliente : this.data.codigo,
      codigoFormaPagto : 0 ,
      dataCadastro : new Date, 
      codigoUsuarioCadastro : this.data.codigoUsuario,
      formaPagamento : null
    } as ClienteFormaPagamento;

    const dialogRef = this.dialog.open(ClienteformapagamentodialogoComponent,
      { width: '800px' ,
       height: '600px;',
       data : { 
                codigo: this.data.codigo,
                codigoUsuario : this.data.codigoUsuario, 
                clienteFormaPagto: novoClienteFormaPagto
              } }
    );
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      this.loadData();
    });
  }
  openDialogEditar(clienteFormaEdit : ClienteFormaPagamento){
     
    const dialogRef = this.dialog.open(ClienteformapagamentodialogoComponent,
      { width: '800px' ,
       height: '600px;',
       data : { 
                codigo: this.data.codigo,
                codigoUsuario : this.data.codigoUsuario, 
                clienteFormaPagto: clienteFormaEdit              
              } }
    );
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      this.loadData();
    });
  }
  openDialogApagar(codigo: number){
    this.alertService.openConfirmModal('Tem certeza que deseja excluir?', 'Excluir - forma de pagamento', (resposta: boolean) => {
      if (resposta) {
        this.apagar(codigo);
        // this.exclusaoCliente(codigo);
      }
    }, 'Sim', 'Não'
    );
  }
  apagar(codigoExcluir: number) {
    
     const codigoClienteExcluir = this.data.codigo;
     
    

    this.clienteFormaPagamentoService.deletePkDuplo(codigoClienteExcluir, codigoExcluir)
                                     .subscribe(result=>{
                                       this.handlerSuccess('Registro apagado com sucesso!');
                                       this.loadData();
                                     },error =>{
                                       console.log('Erro ao excluir a forma de pagamento -' + error);
                                       this.handleError('Houve um erro ao tentar excluir a forma de pagamento.');
                                     }
                                     )
    
  }
}
