import { TipoServico } from '../tipo-servico/tipo-servico';
import { ProfissionalContato } from './profissional-contato/profissional-contato';
import { ProfissionalDocumento } from './profissional-documento/profissional-documento';
import { ProfissionalEndereco } from './profissional-endereco/profissional-endereco';
import { ProfissionalTipoServico } from './profissional-tipo-servico/profissional-tipo-servico';
export interface Profissional{
  codigo: number;
  codigousuariocadastro: number;
  codigousuarioalteracao: number;
  codigoSituacao: number;
  nome: string;
  dataAniversario: Date;
  dataAlteracao: Date;
  dataCadastro: Date;
  observacao: string;
  profissionalContato: ProfissionalContato;
  profissionalDocumento: ProfissionalDocumento;
  profissionalEndereco: ProfissionalEndereco;    
  listatiposervico: Array<ProfissionalTipoServico>;
}
