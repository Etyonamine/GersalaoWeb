import { ProfissionalContato } from "src/app/profissional/profissional-contato/profissional-contato";
import { TipoContato } from "src/app/tipo-contato/tipo-contato";

export interface ContatoDialog {
    operacao: string;    
    codigoUsuario: number;
    profissionalContato : ProfissionalContato;
    tiposContato: TipoContato[]
  }