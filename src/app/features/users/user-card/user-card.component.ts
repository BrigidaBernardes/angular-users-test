import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Usuario } from '../../../core/models/usuario.model';

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss'],
})
export class UserCardComponent {
  @Input({ required: true }) usuario!: Usuario;
  @Output() editar = new EventEmitter<Usuario>();

  aoClicarEditar(): void {
    this.editar.emit(this.usuario);
  }
}
