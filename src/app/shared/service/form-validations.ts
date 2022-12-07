import { UntypedFormArray, UntypedFormControl, UntypedFormGroup } from "@angular/forms";


export class FormValidations {

  static requiredMinCheckbox(min = 1) {
    const validator = (formArray: UntypedFormArray) => {
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

  static cepValidator(control: UntypedFormControl) {
    const cep = control.value;

    if (cep && cep !== '') {
      const validacep = /^[0-9]{8}$/;
      return validacep.test(cep) ? null : { cepInvalido: true };
    }
    return null;
  }

  static equalsTo(otherField: string) {
    const validator = (formControl: UntypedFormControl) => {

      if (otherField == null) {
        throw new Error('É necessário informar o campo')
      }


      if (!formControl.root || !(<UntypedFormGroup>formControl.root).controls) {
        return null;
      }

      const field = (<UntypedFormGroup>formControl.root).get(otherField);


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

  static validaTodosControlesNulosOuVazios(nomesCampos: string[], formulario: UntypedFormGroup) {
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

  static quantidadeControlesNulos(nomesCampos: string[], formulario: UntypedFormGroup) {
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

  static validateAllFormFields(formGroup: UntypedFormGroup) {         //{1}
    Object.keys(formGroup.controls).forEach(field => {  //{2}
      const control = formGroup.get(field);             //{3}
      if (control instanceof UntypedFormControl) {             //{4}
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof UntypedFormGroup) {        //{5}
        this.validateAllFormFields(control);            //{6}
      }
    });
  }

}
