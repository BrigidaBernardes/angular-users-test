import { FormControl } from '@angular/forms';
import { cpfValidator } from './cpf.validator';

describe('cpfValidator', () => {
  const validador = cpfValidator();

  it('deve aceitar um CPF válido (com máscara)', () => {
    expect(validador(new FormControl('111.444.777-35'))).toBeNull();
  });

  it('deve aceitar um CPF válido (somente dígitos)', () => {
    expect(validador(new FormControl('11144477735'))).toBeNull();
  });

  it('deve rejeitar CPF com dígito verificador incorreto', () => {
    expect(validador(new FormControl('123.456.789-00'))).toEqual({ cpfInvalido: true });
  });

  it('deve rejeitar CPF com todos os dígitos iguais', () => {
    expect(validador(new FormControl('111.111.111-11'))).toEqual({ cpfInvalido: true });
  });

  it('deve rejeitar CPF com quantidade incorreta de dígitos', () => {
    expect(validador(new FormControl('123.456'))).toEqual({ cpfInvalido: true });
  });

  it('deve considerar campo vazio válido (uso em conjunto com Validators.required)', () => {
    expect(validador(new FormControl(''))).toBeNull();
  });
});
