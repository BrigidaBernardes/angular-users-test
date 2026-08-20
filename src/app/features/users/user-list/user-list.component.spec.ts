import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { of } from 'rxjs';
import { UserListComponent } from './user-list.component';
import { UsuarioService } from '../../../core/services/usuario.service';
import { UsuarioStore } from '../../../core/services/usuario-store.service';

describe('UserListComponent', () => {
  let fixture: ComponentFixture<UserListComponent>;
  let component: UserListComponent;
  let store: UsuarioStore;

  // A criação do componente injeta a UsuarioStore, cujo construtor dispara a carga
  // inicial (debounce 300ms + 600ms de latência simulada) — por isso beforeEach
  // também roda em fakeAsync, com tick suficiente para essa carga terminar.
  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [UserListComponent],
      providers: [provideNoopAnimations()],
    });
    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(UsuarioStore);
    fixture.detectChanges();
    tick(1000);
    fixture.detectChanges();
  }));

  it('deve ser criado', () => {
    expect(component).toBeTruthy();
  });

  it('deve exibir a lista de usuários após o carregamento', () => {
    expect(store.usuarios().length).toBeGreaterThan(0);
    const cards = fixture.nativeElement.querySelectorAll('app-user-card');
    expect(cards.length).toBeGreaterThan(0);
  });

  it('deve exibir mensagem de erro quando o serviço falhar', fakeAsync(() => {
    const usuarioService = TestBed.inject(UsuarioService);
    usuarioService.definirForcarErro(true);

    component.tentarNovamente();
    tick(1000);
    fixture.detectChanges();

    expect(store.erro()).toBeTruthy();
    const mensagemErro = fixture.nativeElement.querySelector('.pagina__estado--erro');
    expect(mensagemErro).toBeTruthy();
  }));

  it('deve chamar store.buscar ao digitar no campo de filtro', () => {
    const spy = jest.spyOn(store, 'buscar');

    component.searchControl.setValue('Ana');

    expect(spy).toHaveBeenCalledWith('Ana');
  });

  it('deve abrir o modal ao clicar no botão de novo usuário', () => {
    const dialog = TestBed.inject(MatDialog);
    const dialogRefMock = { afterClosed: () => of(undefined) };
    const spy = jest.spyOn(dialog, 'open').mockReturnValue(dialogRefMock as never);

    component.abrirModalNovoUsuario();

    expect(spy).toHaveBeenCalled();
  });

  it('deve atualizar a página exibida ao paginar', () => {
    const evento: PageEvent = { pageIndex: 1, pageSize: 12, length: 20 };

    component.aoMudarPagina(evento);

    expect(component.pageIndex()).toBe(1);
    expect(component.pageSize()).toBe(12);
  });
});
