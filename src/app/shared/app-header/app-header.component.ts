import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { IonHeader, IonToolbar, IonButtons, IonButton, IonIcon } from '@ionic/angular/standalone';

/**
 * Header propio de la app: nada de barra sólida ni ion-title por defecto.
 * Muestra la marca (icono + nombre) y un acceso a Ajustes (modo claro/oscuro,
 * idioma y legal viven ahí, no directamente en el header).
 * Se usa en todas las pestañas para que la cabecera sea coherente en toda la app.
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslatePipe, IonHeader, IonToolbar, IonButtons, IonButton, IonIcon],
  templateUrl: './app-header.component.html',
  styleUrl: './app-header.component.scss',
})
export class AppHeaderComponent {
  @Input() title = 'Sendero Épico';
  @Input() icon = 'trail-sign-outline';
}
