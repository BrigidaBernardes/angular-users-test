import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { NovoUsuario, Usuario } from '../models/usuario.model';

const USUARIOS_INICIAIS: Usuario[] = [
  { id: '1', nome: 'Giana Sandrini', email: 'giana@attornatus.com.br', cpf: '123.456.789-09', telefone: '(11) 98765-4321', tipoTelefone: 'celular' },
  { id: '2', nome: 'Ana Beatriz Souza', email: 'ana.souza@email.com', cpf: '234.567.891-00', telefone: '(11) 98888-1111', tipoTelefone: 'celular' },
  { id: '3', nome: 'Carlos Eduardo Lima', email: 'carlos.lima@email.com', cpf: '345.678.912-01', telefone: '(11) 3456-7890', tipoTelefone: 'residencial' },
  { id: '4', nome: 'Fernanda Costa Ribeiro', email: 'fernanda.ribeiro@email.com', cpf: '456.789.123-02', telefone: '(11) 97777-2222', tipoTelefone: 'celular' },
  { id: '5', nome: 'João Pedro Almeida', email: 'joao.almeida@email.com', cpf: '567.891.234-03', telefone: '(11) 2345-6789', tipoTelefone: 'comercial' },
  { id: '6', nome: 'Juliana Martins Rocha', email: 'juliana.rocha@email.com', cpf: '678.912.345-04', telefone: '(11) 96666-3333', tipoTelefone: 'celular' },
  { id: '7', nome: 'Lucas Gabriel Ferreira', email: 'lucas.ferreira@email.com', cpf: '789.123.456-05', telefone: '(11) 3222-4444', tipoTelefone: 'residencial' },
  { id: '8', nome: 'Mariana Oliveira Santos', email: 'mariana.santos@email.com', cpf: '891.234.567-06', telefone: '(11) 95555-8888', tipoTelefone: 'celular' },
];

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private usuarios: Usuario[] = [...USUARIOS_INICIAIS];
  private forcarErro = false;

  /** Liga/desliga a simulação de falha da API — usado para testar o estado de erro manualmente. */
  definirForcarErro(valor: boolean): void {
    this.forcarErro = valor;
  }

  listar(filtroNome = ''): Observable<Usuario[]> {
    if (this.forcarErro) {
      return throwError(() => new Error('Não foi possível carregar os usuários. Tente novamente.')).pipe(
        delay(600)
      );
    }

    const termo = filtroNome.trim().toLowerCase();
    const resultado = termo
      ? this.usuarios.filter((usuario) => usuario.nome.toLowerCase().includes(termo))
      : this.usuarios;

    return of([...resultado]).pipe(delay(600));
  }

  criar(novoUsuario: NovoUsuario): Observable<Usuario> {
    const usuario: Usuario = { ...novoUsuario, id: this.gerarId() };
    this.usuarios = [usuario, ...this.usuarios];
    return of(usuario).pipe(delay(500));
  }

  atualizar(id: string, dados: NovoUsuario): Observable<Usuario> {
    this.usuarios = this.usuarios.map((usuario) => (usuario.id === id ? { ...dados, id } : usuario));
    const atualizado = this.usuarios.find((usuario) => usuario.id === id);
    if (!atualizado) {
      return throwError(() => new Error('Usuário não encontrado.'));
    }
    return of(atualizado).pipe(delay(500));
  }

  private gerarId(): string {
    return typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }
}
