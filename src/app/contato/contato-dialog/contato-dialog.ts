import { ProfissionalContato } from "src/app/profissional/profissional-contato/profissional-contato";

export interface ContatoDialog {
    operacao: string;    
    codigoUsuario: number;
    profissionalContato : ProfissionalContato
  }