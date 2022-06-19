import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
 

@Component({
  selector: 'app-base-form',
  template: '<div></div>'
})
export abstract class BaseFormComponent implements OnInit {

  formulario: FormGroup;
  
  

  constructor() { }

  ngOnInit(): void {
  }

  abstract submit();

  onSubmit(){
    if(this.formulario.valid){
      this.submit();
    }
    else
    {
      console.log('formulario invalido');
      this.verificaValidacoesFormulario(this.formulario);
    }
  }

  verificaValidacoesFormulario(formGroup: FormGroup | FormArray)
  {

    Object.keys(formGroup.controls).forEach(campo => {

        const controle = formGroup.get(campo);
        controle.markAsDirty();
        controle.markAsTouched();
        if (controle instanceof FormGroup || controle instanceof FormArray){
          this.verificaValidacoesFormulario(controle);
        }
     });
  }

  resetar(){
    this.formulario.reset();
  }

  verificaValidTouched(campo){
    return !this.formulario.get(campo).valid &&
    (this.formulario.get(campo).touched  );
  }

  verificaRequired(campo){
    return !this.formulario.get(campo).hasError('Required') &&
    this.formulario.get(campo).touched;
  }

  verificarEmailInvalido(){
    let campoEmail = this.formulario.get('email');
    if (campoEmail.errors){
      return campoEmail.errors['email'] && campoEmail.touched;
    }
  }

  aplicaCssErro(campo){
    return {
      'has-error' : this.verificaValidTouched(campo),
      'has-feedback' : this.verificaValidTouched(campo)
    }
  }

  getCampo(campo: string){
    return this.formulario.get(campo);
  }  
  dataHoraAtualSemTimeZone(){
    const hj = new Date();

    return new Date( `${hj.getFullYear()}/${(`"0"+ ${hj.getMonth() + 1}`).slice(-2)}/${("0"+(hj.getDate())).slice(-2)} ${("0"+(hj.getHours())).slice(-2)}:${("0"+(hj.getMinutes())).slice(-2)}:${("0"+(hj.getSeconds())).slice(-2)} -00:00`);
    
  }

  pad(value) {
    return value.toString().padStart(2, 0);
  }
}
