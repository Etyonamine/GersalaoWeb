import { Contato } from "src/app/contato/contato";

export interface ProfissionalContato{

  codigoProfissional : number;
  codigoContato : number;
  codigoUsuarioCadastro : number;  
  dataCadastro : Date;  
  contato: Contato;
}
