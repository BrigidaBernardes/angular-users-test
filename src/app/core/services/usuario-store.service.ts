import { Injectable, inject, signal } from '@angular/core';
import { Observable, Subject, catchError, debounceTime, of, switchMap, tap } from 'rxjs';
import { NovoUsuario, Usuario } from '../models/usuario.model';
import { UsuarioService } from './usuario.service';

@Injectable({ providedIn: 'root' })
export class UsuarioStore {
  private readonly usuarioService = inject(UsuarioService);

  private readonly _usuarios = signal<Usuario[]>([]);
  private readonly _carregando = signal(false);
  private readonly _erro = signal<string | null>(null);

  private readonly filtro$ = new Subject<string>();
  private filtroAtual = '';

  readonly usuarios = this._usuarios.asReadonly();
  readonly carregando = this._carregando.asReadonly();
  readonly erro = this._erro.asReadonly();

  constructor() {
    this.filtro$
      .pipe(
        debounceTime(300),
        tap((filtro) => {
          this.filtroAtual = filtro;
          this._carregando.set(true);
          this._erro.set(null);
        }),
        switchMap((filtro) =>
          this.usuarioService.listar(filtro).pipe(
            catchError((erro: Error) => {
              this._erro.set(erro.message || 'Erro ao carregar usuários. Tente novamente.');
              return of(null);
            })
          )
        )
      )
      .subscribe((usuarios) => {
        this._carregando.set(false);
        if (usuarios) {
          this._usuarios.set(usuarios);
        }
      });

    this.buscar('');
  }

  buscar(filtroNome: string): void {
    this.filtro$.next(filtroNome);
  }

  /** Reexecuta a última busca — usado após criar/editar e no botão "tentar novamente". */
  recarregar(): void {
    this.filtro$.next(this.filtroAtual);
  }

  criarUsuario(dados: NovoUsuario): Observable<Usuario> {
    return this.usuarioService.criar(dados).pipe(tap(() => this.recarregar()));
  }

  atualizarUsuario(id: string, dados: NovoUsuario): Observable<Usuario> {
    return this.usuarioService.atualizar(id, dados).pipe(tap(() => this.recarregar()));
  }
}
