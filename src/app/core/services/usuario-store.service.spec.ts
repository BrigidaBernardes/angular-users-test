import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { UsuarioService } from './usuario.service';
import { UsuarioStore } from './usuario-store.service';

describe('UsuarioStore', () => {
  let store: UsuarioStore;

  // A construção do store dispara a carga inicial (debounce de 300ms + 600ms de
  // latência simulada) — precisa acontecer dentro de uma zona fakeAsync para que os
  // timers do RxJS sejam controlados pelo tick() abaixo.
  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({});
    store = TestBed.inject(UsuarioStore);
    tick(1000);
  }));

  it('deve ser criado', () => {
    expect(store).toBeTruthy();
  });

  it('deve carregar os usuários iniciais assim que criado', () => {
    expect(store.usuarios().length).toBeGreaterThan(0);
    expect(store.carregando()).toBe(false);
    expect(store.erro()).toBeNull();
  });

  it('deve aguardar o debounce de 300ms antes de buscar', fakeAsync(() => {
    store.buscar('filtro-teste');

    tick(150);
    expect(store.carregando()).toBe(false);

    tick(200); // total 350ms — debounce (300ms) já deve ter disparado
    expect(store.carregando()).toBe(true);

    tick(700); // aguarda a resposta mockada do serviço
    expect(store.carregando()).toBe(false);
  }));

  it('deve expor mensagem de erro quando o serviço falhar', fakeAsync(() => {
    const usuarioService = TestBed.inject(UsuarioService);
    usuarioService.definirForcarErro(true);

    store.buscar('qualquer');
    tick(1000);

    expect(store.erro()).toBeTruthy();
    expect(store.carregando()).toBe(false);
  }));

  it('deve recarregar a lista após criar um usuário', fakeAsync(() => {
    const totalAntes = store.usuarios().length;

    store.criarUsuario({
      nome: 'Novo Usuário Store',
      email: 'novo-store@email.com',
      cpf: '111.444.777-35',
      telefone: '(11) 91234-5678',
      tipoTelefone: 'celular',
    }).subscribe();

    tick(2000); // aguarda criação (500ms) + debounce (300ms) + recarga (600ms), com folga

    expect(store.usuarios().length).toBe(totalAntes + 1);
  }));
});
