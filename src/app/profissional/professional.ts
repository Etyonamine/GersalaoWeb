import { ProfissionalTipoServico } from './profissional-tipo-servico/profissional-tipo-servico';
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
<<<<<<< HEAD
  profissionalEndereco: ProfissionalEndereco;    
  listatiposervico: Array<ProfissionalTipoServico>;
=======
  profissionalEndereco: ProfissionalEndereco;
  tipoServicos: Array<ProfissionalTipoServico>;
>>>>>>> c893be033f1accde49973bdbfe9fbdaa9c655d08
}
