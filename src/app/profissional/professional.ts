import { TipoServico } from '../tipo-servico/tipo-servico';
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
  dataAlteracao: Date;
  dataCadastro: Date;
  observacao: string;
  profissionalContato : ProfissionalContato;
  profissionalDocumento : ProfissionalDocumento;
  profissionalEndereco : ProfissionalEndereco;
  tipoServico: Array<number>;
}
