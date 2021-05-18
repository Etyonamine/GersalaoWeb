import { FormArray, FormControl, FormGroup } from "@angular/forms";


export class FormValidations {

  static requiredMinCheckbox(min = 1) {
    const validator = (formArray: FormArray) => {
      //const values = formArray.controls;


      // for (let i=0; i < values. length; i++)
      // {
      //   if (values[i].value){
      //     totalChecked += 1;
      //   }
      // }

      const totalChecked = formArray.controls
        .map(v => v.value)
        .reduce((total, current) => current ? total + current : total, 0);


      return (totalChecked < min) ? null : { required: true };
    };
    return validator;
  }

  static cepValidator(control: FormControl) {
    const cep = control.value;

    if (cep && cep !== '') {
      const validacep = /^[0-9]{8}$/;
      return validacep.test(cep) ? null : { cepInvalido: true };
    }
    return null;
  }

  static equalsTo(otherField: string) {
    const validator = (formControl: FormControl) => {

      if (otherField == null) {
        throw new Error('É necessário informar o campo')
      }


      if (!formControl.root || !(<FormGroup>formControl.root).controls) {
        return null;
      }

      const field = (<FormGroup>formControl.root).get(otherField);


      if (!field) {
        throw new Error('É necessário informar o campo válido.');
      }

      if ((field.value !== formControl.value)) {
        console.log('passo RETORNA ERRRO');

        return { equalsTo: otherField };
      }

      return null;
    };

    return validator;


  }

  static getErrorMsg(fieldName: string, validatorName: string, validatorValue?: any) {

    const config = {
      'required': `${fieldName} é obrigatório.`,
      'minlength': `${fieldName} precisa ter no minimo ${validatorValue.requiredLength} caracteres.`,
      'maxlength': `${fieldName} precisa ter no máximo ${validatorValue.requiredLength} caracteres.`,
      'cepInvalido': 'CEP invalido.'
    };

    return config[validatorName];
  }

  static validaTodosControlesNulosOuVazios(nomesCampos: string[], formulario: FormGroup) {
    if (nomesCampos.length > 0) {

      var iContador: number = 0;

      for (let i = 0; i < nomesCampos.length; i++) {
        if (formulario.get(nomesCampos[i]).value == null || (formulario.get(nomesCampos[i]).value || '') == '') {
          iContador = iContador + 1;
        }
      }
      if (iContador !== nomesCampos.length) {
        return false;
      }

    }

    return true;


  }

  static quantidadeControlesNulos(nomesCampos: string[], formulario: FormGroup) {
    {

      var iContador: number = 0;

      if (nomesCampos.length > 0) {
        for (let i = 0; i < nomesCampos.length; i++) {
          if (formulario.get(nomesCampos[i]).value == null || (formulario.get(nomesCampos[i]).value || '') == '') {
            iContador = iContador + 1;
          }
        }
      }
      return iContador;

    }
  }

  static validateAllFormFields(formGroup: FormGroup) {         //{1}
    Object.keys(formGroup.controls).forEach(field => {  //{2}
      const control = formGroup.get(field);             //{3}
      if (control instanceof FormControl) {             //{4}
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {        //{5}
        this.validateAllFormFields(control);            //{6}
      }
    });
  }

}
