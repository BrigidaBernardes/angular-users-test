import { Component, DestroyRef, Inject, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UsuarioStore } from '../../../core/services/usuario-store.service';
import { TipoTelefone, Usuario } from '../../../core/models/usuario.model';
import { cpfValidator } from '../../../core/validators/cpf.validator';
import { telefoneValidator } from '../../../core/validators/telefone.validator';

interface OpcaoTipoTelefone {
  valor: TipoTelefone;
  rotulo: string;
}


@Component({
  selector: 'app-user-form-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './user-form-modal.component.html',
  styleUrls: ['./user-form-modal.component.scss'],
})
export class UserFormModalComponent {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(UsuarioStore);
  private readonly dialogRef = inject(MatDialogRef<UserFormModalComponent>);
  private readonly destroyRef = inject(DestroyRef);

  readonly salvando = signal(false);
  readonly erroSalvar = signal<string | null>(null);
  readonly modoEdicao: boolean;

  readonly tiposTelefone: OpcaoTipoTelefone[] = [
    { valor: 'celular', rotulo: 'Celular' },
    { valor: 'residencial', rotulo: 'Residencial' },
    { valor: 'comercial', rotulo: 'Comercial' },
  ];

  readonly formulario = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    nome: ['', [Validators.required, Validators.minLength(3)]],
    cpf: ['', [Validators.required, cpfValidator()]],
    telefone: ['', [Validators.required, telefoneValidator()]],
    tipoTelefone: ['celular' as TipoTelefone, [Validators.required]],
  });

  constructor(@Inject(MAT_DIALOG_DATA) private readonly usuario: Usuario | null) {
    this.modoEdicao = !!this.usuario;
    if (this.usuario) {
      this.formulario.patchValue({
        email: this.usuario.email,
        nome: this.usuario.nome,
        cpf: this.usuario.cpf,
        telefone: this.usuario.telefone,
        tipoTelefone: this.usuario.tipoTelefone,
      });
    }
  }

  salvar(): void {
    if (this.formulario.invalid || this.salvando()) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.salvando.set(true);
    this.erroSalvar.set(null);
    const dados = this.formulario.getRawValue();

    const operacao$ = this.modoEdicao
      ? this.store.atualizarUsuario(this.usuario!.id, dados)
      : this.store.criarUsuario(dados);

    operacao$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (usuario) => {
        this.salvando.set(false);
        this.dialogRef.close(usuario);
      },
      error: () => {
        this.salvando.set(false);
        this.erroSalvar.set('Não foi possível salvar. Tente novamente.');
      },
    });
  }

  fechar(): void {
    this.dialogRef.close();
  }

  mensagemErro(campo: string): string {
    const control = this.formulario.get(campo);
    if (!control || !control.errors) {
      return '';
    }
    if (control.errors['required']) return 'Campo obrigatório.';
    if (control.errors['email']) return 'Informe um e-mail válido.';
    if (control.errors['minlength']) return 'Nome muito curto.';
    if (control.errors['cpfInvalido']) return 'CPF inválido.';
    if (control.errors['telefoneInvalido']) return 'Use o formato (11) 98765-4321.';
    return 'Valor inválido.';
  }
}
