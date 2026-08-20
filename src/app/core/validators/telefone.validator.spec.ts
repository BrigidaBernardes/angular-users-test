import { FormControl } from '@angular/forms';
import { telefoneValidator } from './telefone.validator';

describe('telefoneValidator', () => {
  const validador = telefoneValidator();

  it('deve aceitar celular no formato correto (9 dígitos)', () => {
    expect(validador(new FormControl('(11) 98765-4321'))).toBeNull();
  });

  it('deve aceitar telefone fixo no formato correto (8 dígitos)', () => {
    expect(validador(new FormControl('(11) 3456-7890'))).toBeNull();
  });

  it('deve rejeitar telefone sem formatação', () => {
    expect(validador(new FormControl('11987654321'))).toEqual({ telefoneInvalido: true });
  });

  it('deve rejeitar telefone com DDD faltando', () => {
    expect(validador(new FormControl('98765-4321'))).toEqual({ telefoneInvalido: true });
  });

  it('deve considerar campo vazio válido (uso em conjunto com Validators.required)', () => {
    expect(validador(new FormControl(''))).toBeNull();
  });
});
