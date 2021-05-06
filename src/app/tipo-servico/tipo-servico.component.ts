import { AlertService } from './../shared/alert/alert.service';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { TipoServico } from './tipo-servico';
import { TipoServicoService } from './tipo-servico.service';

@Component({
  selector: 'app-tipo-servico',
  templateUrl: './tipo-servico.component.html',
  styleUrls: ['./tipo-servico.component.scss']
})
export class TipoServicoComponent implements OnInit, OnDestroy {
  inscricao$ : Subscription;
  tipoServicos: Array<TipoServico> = [];

  constructor(private tipoServicoService : TipoServicoService,
              private alertService: AlertService) { }

  ngOnInit(): void {
    this.loadDatas();
  }

  ngOnDestroy(): void{
    this.inscricao$.unsubscribe();
  }
  loadDatas(){
   this.inscricao$ = this.tipoServicoService.list<TipoServico[]>()
                                            .subscribe(result=> this.tipoServicos = result,
                                                      error=>{
                                                        console.log(error);
                                                        this.mensagemError('Ocorreu um erro na tentativa de listar os tipos de serviço');
                                                      })

  }

  mensagemError(msg : string){
    this.alertService.mensagemErro(msg);
  }

  openConfirmExclusao(codigo : number) {
    this.alertService.openConfirmModal('Tem certeza que deseja excluir?', 'Excluir - Cliente', (answer: boolean) => {
      if (answer) {

        this.exclusaoCliente(codigo);
      }
    }, "Sim", "Não"
    );
  }

  exclusaoCliente(codigo : number){

    var msgSucess : string = 'Registro excluído com sucesso!';
    var msgErro : string  = 'Ocorreu um erro na tentativa de exclusão  do cliente.';

    this.tipoServicoService.delete(codigo).subscribe(sucesso=>{
      this.handlerSuccess(msgSucess);
      setTimeout(() => { this.loadDatas(); }, 3000);
    }, error=>
    {
      console.log(error);
      this.handleError(msgErro);
    });
  }

  handlerSuccess(msg: string) {
    this.alertService.mensagemSucesso(msg);
  }

  handleError(msg: string) {
    this.alertService.mensagemErro(msg);
  }
}
