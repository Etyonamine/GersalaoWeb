export interface Endereco{
  codigo:number;
  codigoTipoEndereco :number;
  codigoUnidadeFederativa:number;
  codigoMunicipio:number;
  codigoSituacao:number;
  descricao:string;
  numero :string;
  complemento:string;
  bairro :string;
  cep:number;
  dataCadastro :Date;
  codigoUsuarioCadastrado:number;
  dataAlteracao :Date;
  codigoUsuarioAlteracao:Date;
}
