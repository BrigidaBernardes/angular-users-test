import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { UsuarioService } from './usuario.service';

describe('UsuarioService', () => {
  let service: UsuarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsuarioService);
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  it('deve listar os usuários iniciais', async () => {
    const usuarios = await firstValueFrom(service.listar());
    expect(usuarios.length).toBeGreaterThan(0);
  });

  it('deve filtrar usuários por nome (case-insensitive)', async () => {
    const todos = await firstValueFrom(service.listar());
    const alvo = todos[0];
    const termo = alvo.nome.substring(0, 4).toUpperCase();

    const filtrados = await firstValueFrom(service.listar(termo));

    expect(filtrados.length).toBeGreaterThan(0);
    expect(filtrados.every((u) => u.nome.toLowerCase().includes(termo.toLowerCase()))).toBe(true);
  });

  it('deve retornar lista vazia quando nenhum nome bate com o filtro', async () => {
    const filtrados = await firstValueFrom(service.listar('zzzzzzz-nao-existe'));
    expect(filtrados).toEqual([]);
  });

  it('deve criar um novo usuário e incluí-lo na listagem', async () => {
    const novo = {
      nome: 'Usuário de Teste',
      email: 'teste@email.com',
      cpf: '111.444.777-35',
      telefone: '(11) 99999-8888',
      tipoTelefone: 'celular' as const,
    };

    const criado = await firstValueFrom(service.criar(novo));
    expect(criado.id).toBeTruthy();
    expect(criado.nome).toBe(novo.nome);

    const todos = await firstValueFrom(service.listar());
    expect(todos.some((u) => u.id === criado.id)).toBe(true);
  });

  it('deve atualizar um usuário existente', async () => {
    const todos = await firstValueFrom(service.listar());
    const alvo = todos[0];

    const atualizado = await firstValueFrom(
      service.atualizar(alvo.id, { ...alvo, nome: 'Nome Atualizado' })
    );

    expect(atualizado.id).toBe(alvo.id);
    expect(atualizado.nome).toBe('Nome Atualizado');
  });

  it('deve emitir erro ao listar quando forcarErro estiver ativo', async () => {
    service.definirForcarErro(true);
    await expect(firstValueFrom(service.listar())).rejects.toThrow();
  });
});
