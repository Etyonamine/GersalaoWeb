import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth-guard/auth.service';
import { ClienteReportService } from '../cliente-report.service';

@Component({
  selector: 'app-cliente-report',
  templateUrl: './cliente-report.component.html',
  styleUrls: ['./cliente-report.component.scss']
})
export class ClienteReportComponent implements OnInit {
  nomeUsuario : string ='';
  type = 'application/pdf' ;
  inscricao$:Subscription;
  inscricaoAuth$:Subscription;
  
  constructor(private reportClienteService:ClienteReportService,
              private authService : AuthService) { }

  ngOnInit(): void {
    this.nomeUsuario = this.authService.usuarioLogado.login;
  }
  ngOnDestroy(): void {
    if (this.inscricao$){
      this.inscricao$.unsubscribe();
    }
    if (this.inscricaoAuth$){
      this.inscricaoAuth$.unsubscribe();
    }
  }
  gerarRelatorioClientes(){
    this.inscricao$ = this.reportClienteService.gerarListaClientes(this.nomeUsuario).subscribe(respData => {
      this.downLoadFile(respData, this.type);
    },error=>{
      console.log(error);
    }
    );
  }
  /**
 * Method is use to download file from server.
 * @param data - Array Buffer data
 * @param type - type of the document.
 */
  downLoadFile(data: any, type: string) {
    var blob = new Blob([data], { type: type.toString() });
    var url = window.URL.createObjectURL(blob);
    var pwa = window.open(url);
    if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
        alert('Por favor, desbloquear o pop-up e tentar novamente.');
    }
  }
}
