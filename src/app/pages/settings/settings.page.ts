import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonBackButton,
  IonTitle,
  IonContent,
  IonIcon,
  IonToggle,
  IonModal,
} from '@ionic/angular/standalone';
import { ThemeService } from '../../core/services/theme.service';
import { LanguageService, AppLanguage } from '../../core/services/language.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    TranslatePipe,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonBackButton,
    IonTitle,
    IonContent,
    IonIcon,
    IonToggle,
    IonModal,
  ],
  templateUrl: './settings.page.html',
  styleUrl: './settings.page.scss',
})
export class SettingsPage {
  readonly legalOpen = signal(false);

  constructor(
    public theme: ThemeService,
    public language: LanguageService
  ) {}

  onDarkModeChange(event: CustomEvent): void {
    const checked = (event.detail as { checked: boolean }).checked;
    void this.theme.setDark(checked);
  }

  setLanguage(lang: AppLanguage): void {
    void this.language.setLanguage(lang);
  }

  openLegal(): void {
    this.legalOpen.set(true);
  }

  closeLegal(): void {
    this.legalOpen.set(false);
  }
}
