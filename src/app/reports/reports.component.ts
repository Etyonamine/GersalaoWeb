import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth-guard/auth.service';
import { ClienteReportService } from './cliente-report.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  nomeUsuario : string ='';

  constructor(private reportClienteService:ClienteReportService,
              private authService : AuthService) { }
 type = 'application/pdf' ;
  inscricao$:Subscription;
  inscricaoAuth$:Subscription;

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
        alert('Please disable your Pop-up blocker and try again.');
    }
}

}
