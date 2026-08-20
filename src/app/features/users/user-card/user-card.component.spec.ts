import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { Usuario } from '../../../core/models/usuario.model';
import { UserCardComponent } from './user-card.component';

describe('UserCardComponent', () => {
  let fixture: ComponentFixture<UserCardComponent>;
  let component: UserCardComponent;

  const usuarioMock: Usuario = {
    id: '1',
    nome: 'Fulano de Tal',
    email: 'fulano@email.com',
    cpf: '111.444.777-35',
    telefone: '(11) 98888-7777',
    tipoTelefone: 'celular',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [UserCardComponent],
      providers: [provideNoopAnimations()],
    });
    fixture = TestBed.createComponent(UserCardComponent);
    component = fixture.componentInstance;
    component.usuario = usuarioMock;
    fixture.detectChanges();
  });

  it('deve ser criado', () => {
    expect(component).toBeTruthy();
  });

  it('deve exibir o nome e o e-mail do usuário', () => {
    const texto: string = fixture.nativeElement.textContent;
    expect(texto).toContain(usuarioMock.nome);
    expect(texto).toContain(usuarioMock.email);
  });

  it('deve emitir o evento editar com o usuário ao clicar no botão', () => {
    const spy = jest.spyOn(component.editar, 'emit');
    const botao: HTMLButtonElement = fixture.nativeElement.querySelector('button');

    botao.click();

    expect(spy).toHaveBeenCalledWith(usuarioMock);
  });
});
