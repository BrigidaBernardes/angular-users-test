import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Usuario } from '../../../core/models/usuario.model';
import { UserFormModalComponent } from './user-form-modal.component';

describe('UserFormModalComponent', () => {
  let fixture: ComponentFixture<UserFormModalComponent>;
  let component: UserFormModalComponent;
  let dialogRefMock: { close: jest.Mock };

  function criarComponente(dadosUsuario: Usuario | null): void {
    dialogRefMock = { close: jest.fn() };

    TestBed.configureTestingModule({
      imports: [UserFormModalComponent],
      providers: [
        provideNoopAnimations(),
        { provide: MAT_DIALOG_DATA, useValue: dadosUsuario },
        { provide: MatDialogRef, useValue: dialogRefMock },
      ],
    });

    fixture = TestBed.createComponent(UserFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  describe('modo criação', () => {
    beforeEach(() => criarComponente(null));

    it('deve iniciar em modo criação, com formulário vazio e inválido', () => {
      expect(component.modoEdicao).toBe(false);
      expect(component.formulario.invalid).toBe(true);
    });

    it('deve marcar o campo nome como obrigatório', () => {
      const nome = component.formulario.get('nome')!;
      nome.markAsTouched();
      expect(nome.hasError('required')).toBe(true);
    });

    it('deve rejeitar um CPF inválido', () => {
      const cpf = component.formulario.get('cpf')!;
      cpf.setValue('123.456.789-00');
      expect(cpf.hasError('cpfInvalido')).toBe(true);
    });

    it('deve aceitar um CPF válido', () => {
      const cpf = component.formulario.get('cpf')!;
      cpf.setValue('111.444.777-35');
      expect(cpf.valid).toBe(true);
    });

    it('deve rejeitar telefone em formato incorreto', () => {
      const telefone = component.formulario.get('telefone')!;
      telefone.setValue('11987654321');
      expect(telefone.hasError('telefoneInvalido')).toBe(true);
    });

    it('deve manter o botão salvar desabilitado enquanto o formulário for inválido', () => {
      const botaoSalvar: HTMLButtonElement = fixture.nativeElement.querySelector('button[type="submit"]');
      expect(botaoSalvar.disabled).toBe(true);
    });

    it('deve habilitar o botão salvar quando todos os campos ficarem válidos', () => {
      component.formulario.setValue({
        email: 'novo@email.com',
        nome: 'Novo Usuário Teste',
        cpf: '111.444.777-35',
        telefone: '(11) 91234-5678',
        tipoTelefone: 'celular',
      });
      fixture.detectChanges();

      const botaoSalvar: HTMLButtonElement = fixture.nativeElement.querySelector('button[type="submit"]');
      expect(botaoSalvar.disabled).toBe(false);
    });

    it('deve salvar um novo usuário e fechar o modal com o resultado', fakeAsync(() => {
      component.formulario.setValue({
        email: 'novo@email.com',
        nome: 'Novo Usuário Teste',
        cpf: '111.444.777-35',
        telefone: '(11) 91234-5678',
        tipoTelefone: 'celular',
      });

      component.salvar();
      tick(600);

      expect(dialogRefMock.close).toHaveBeenCalled();
      const usuarioSalvo = dialogRefMock.close.mock.calls[0][0];
      expect(usuarioSalvo.nome).toBe('Novo Usuário Teste');

      tick(1500); // esvazia o recarregamento em segundo plano disparado pela store
    }));

    it('não deve chamar salvar quando o formulário estiver inválido', () => {
      component.salvar();
      expect(dialogRefMock.close).not.toHaveBeenCalled();
    });
  });

  describe('modo edição', () => {
    const usuarioExistente: Usuario = {
      id: '9',
      nome: 'Maria Teste',
      email: 'maria@email.com',
      cpf: '111.444.777-35',
      telefone: '(11) 97777-6666',
      tipoTelefone: 'residencial',
    };

    beforeEach(() => criarComponente(usuarioExistente));

    it('deve iniciar em modo edição com o formulário preenchido automaticamente', () => {
      expect(component.modoEdicao).toBe(true);
      expect(component.formulario.get('nome')?.value).toBe(usuarioExistente.nome);
      expect(component.formulario.get('email')?.value).toBe(usuarioExistente.email);
      expect(component.formulario.get('cpf')?.value).toBe(usuarioExistente.cpf);
      expect(component.formulario.get('tipoTelefone')?.value).toBe(usuarioExistente.tipoTelefone);
    });

    it('deve iniciar com o formulário válido, já que os dados existentes são válidos', () => {
      expect(component.formulario.valid).toBe(true);
    });

    it('deve fechar o modal sem salvar ao clicar no botão de fechar', () => {
      component.fechar();
      expect(dialogRefMock.close).toHaveBeenCalledWith();
    });
  });
});
