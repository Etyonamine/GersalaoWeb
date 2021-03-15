import{Component}from '@angular/core';
import{FormGroup} from '@angular/forms';

@Component({
    template:''
})

export class BaseFormComponent{

    //the form model
    form:FormGroup;

    //metodo construtor
    constructor(){}

    //retornando o controle do formulario.
    getControl(nome:string){
        return this.form.get(nome);
    }

    //retorna verdadeiro se o controle do formulario for valido
    isValid(nome:string){
        var e=this.getControl(nome);
        return e && e.valid;
    }

    //retorna verdadeiro se o controle do formulario foi mudado
    isChanged(nome:string){
        var e= this.getControl(nome);
        return e && (e.dirty||e.touched);
    }

    //retorna verdadeiro se o controle do formulario esta com erros.
    hasError(nome:string){
        var e=this.getControl(nome);
        return e && (e.dirty||e.touched)&& e.invalid;
    }

}