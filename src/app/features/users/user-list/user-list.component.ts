import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UsuarioStore } from '../../../core/services/usuario-store.service';
import { Usuario } from '../../../core/models/usuario.model';
import { UserCardComponent } from '../user-card/user-card.component';
import { UserFormModalComponent } from '../user-form-modal/user-form-modal.component';

const TAMANHO_PAGINA_PADRAO = 6;

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatSnackBarModule,
    UserCardComponent,
  ],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent {
  protected readonly store = inject(UsuarioStore);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  readonly searchControl = new FormControl('', { nonNullable: true });

  readonly pageIndex = signal(0);
  readonly pageSize = signal(TAMANHO_PAGINA_PADRAO);

  readonly usuariosPaginados = computed(() => {
    const inicio = this.pageIndex() * this.pageSize();
    return this.store.usuarios().slice(inicio, inicio + this.pageSize());
  });

  constructor() {
    this.searchControl.valueChanges.pipe(takeUntilDestroyed()).subscribe((valor) => {
      this.store.buscar(valor);
    });

    // Sempre que a lista mudar (nova busca, criação, edição), volta para a primeira página.
    effect(() => {
      this.store.usuarios();
      this.pageIndex.set(0);
    });
  }

  aoMudarPagina(evento: PageEvent): void {
    this.pageIndex.set(evento.pageIndex);
    this.pageSize.set(evento.pageSize);
  }

  tentarNovamente(): void {
    this.store.buscar(this.searchControl.value);
  }

  abrirModalNovoUsuario(): void {
    const dialogRef = this.dialog.open(UserFormModalComponent, {
      width: '520px',
      maxWidth: '92vw',
      autoFocus: 'first-tabbable',
      data: null,
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) {
        this.snackBar.open('Usuário cadastrado com sucesso!', 'Fechar', { duration: 3000 });
      }
    });
  }

  abrirModalEdicao(usuario: Usuario): void {
    const dialogRef = this.dialog.open(UserFormModalComponent, {
      width: '520px',
      maxWidth: '92vw',
      autoFocus: 'first-tabbable',
      data: usuario,
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) {
        this.snackBar.open('Usuário atualizado com sucesso!', 'Fechar', { duration: 3000 });
      }
    });
  }
}
