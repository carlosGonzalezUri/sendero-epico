import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { registerAppIcons } from './core/icons';
import { ThemeService } from './core/services/theme.service';
import { LanguageService } from './core/services/language.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [IonApp, IonRouterOutlet, RouterOutlet],
  template: `
    <ion-app>
      <ion-router-outlet></ion-router-outlet>
    </ion-app>
  `,
})
export class AppComponent {
  constructor(
    private theme: ThemeService,
    private language: LanguageService
  ) {
    registerAppIcons();
    void this.theme.init();
    void this.language.init();
  }
}
