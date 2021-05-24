import { ProfissionalContato } from './profissional-contato/profissional-contato';
import { ProfissionalDocumento } from './profissional-documento/profissional-documento';
import { ProfissionalEndereco } from './profissional-endereco/profissional-endereco';
export interface Profissional{
  codigo: number;
  codigousuariocadastro: number;
  codigousuarioalteracao: number;
  codigoSituacao: number;
  nome: string;
  dataaniversario: Date;
  dataalteracao: Date;
  datacadastro: Date;
  observacao: string;
  profissionalContato : ProfissionalContato;
  profissionalDocumento : ProfissionalDocumento;
  profissionalEndereco : ProfissionalEndereco;
}
