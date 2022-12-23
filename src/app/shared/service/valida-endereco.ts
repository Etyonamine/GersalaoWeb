import { Endereco } from "src/app/endereco/endereco";

export class ValidaEndereco{
    static propriedadesNulas(endereco:Endereco){

        //descricao
        if( endereco.descricao !== null ||  endereco.descricao ==undefined ||   endereco.descricao ==''){
            return false;
          }
        
        //numero
        if(endereco.numero !== null ||  endereco.numero ==undefined ||   endereco.numero ==''){
            return false;
        }
        //complemento
        if(endereco.complemento !== null ||  endereco.complemento ==undefined ||   endereco.complemento ==''){
            return false;
        }
        //bairro
        if(endereco.bairro !== null ||  endereco.bairro ==undefined ||   endereco.bairro ==''){
            return false;
        }

        //cep
        if(endereco.cep !== null ||  endereco.cep == undefined ){
            return false;
        }

        //codigo do estado
        if(endereco.codigoUnidadeFederativa !== null ||  endereco.codigoUnidadeFederativa ==undefined ||   endereco.codigoUnidadeFederativa !==0){
            return false;
        }

        //codigo do municipio
        if(endereco.codigoMunicipio !== null ||  endereco.codigoMunicipio ==undefined ||   endereco.codigoMunicipio !== 0 ){
            return false;
        }

        return true;
    }
}