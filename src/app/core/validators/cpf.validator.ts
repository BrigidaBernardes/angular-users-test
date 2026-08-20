import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

function calcularDigitoVerificador(cpfParcial: string, multiplicadorInicial: number): number {
  let soma = 0;
  for (let i = 0; i < cpfParcial.length; i++) {
    soma += parseInt(cpfParcial.charAt(i), 10) * (multiplicadorInicial - i);
  }
  const resto = (soma * 10) % 11;
  return resto === 10 ? 0 : resto;
}


export function cpfValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valor = (control.value ?? '').toString().replace(/\D/g, '');

    if (!valor) {
      return null;
    }

    if (valor.length !== 11 || /^(\d)\1{10}$/.test(valor)) {
      return { cpfInvalido: true };
    }

    const digito1 = calcularDigitoVerificador(valor.substring(0, 9), 10);
    const digito2 = calcularDigitoVerificador(valor.substring(0, 10), 11);

    if (digito1 !== parseInt(valor.charAt(9), 10) || digito2 !== parseInt(valor.charAt(10), 10)) {
      return { cpfInvalido: true };
    }

    return null;
  };
}
