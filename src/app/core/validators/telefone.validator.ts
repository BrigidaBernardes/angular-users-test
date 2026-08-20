import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

const REGEX_TELEFONE = /^\(\d{2}\)\s?\d{4,5}-\d{4}$/;

export function telefoneValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valor = (control.value ?? '').toString().trim();

    if (!valor) {
      return null;
    }

    return REGEX_TELEFONE.test(valor) ? null : { telefoneInvalido: true };
  };
}
