import { Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Preferences } from '@capacitor/preferences';
import { TranslateService } from '@ngx-translate/core';

const LANG_KEY = 'sendero-lang';

export type AppLanguage = 'es' | 'en';

/**
 * Idioma de la app: por defecto español (mismo criterio que el modo de
 * color), con inglés como alternativa desde la pantalla de Ajustes. La
 * elección se guarda en Preferences para recordarla entre sesiones — no
 * seguimos el idioma del sistema automáticamente.
 */
@Injectable({ providedIn: 'root' })
export class LanguageService {
  readonly current = signal<AppLanguage>('es');

  constructor(private translate: TranslateService) {}

  async init(): Promise<void> {
    const stored = await Preferences.get({ key: LANG_KEY });
    const lang: AppLanguage = stored.value === 'en' ? 'en' : 'es';
    this.current.set(lang);
    await firstValueFrom(this.translate.use(lang));
  }

  async setLanguage(lang: AppLanguage): Promise<void> {
    if (lang === this.current()) return;
    this.current.set(lang);
    await firstValueFrom(this.translate.use(lang));
    await Preferences.set({ key: LANG_KEY, value: lang });
  }
}
