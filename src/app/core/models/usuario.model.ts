export type TipoTelefone = 'celular' | 'residencial' | 'comercial';

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  tipoTelefone: TipoTelefone;
}

export type NovoUsuario = Omit<Usuario, 'id'>;
