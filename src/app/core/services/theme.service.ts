import { Injectable, signal } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';

const THEME_KEY = 'sendero-theme';

// Debe coincidir con --ion-toolbar-background en claro/oscuro (src/theme/variables.css).
const STATUS_BAR_BG_LIGHT = '#ffffff';
const STATUS_BAR_BG_DARK = '#1b2126';

/**
 * Controla el modo claro/oscuro manualmente (no seguimos el
 * prefers-color-scheme del sistema): la app arranca siempre en claro y el
 * usuario decide desde la pantalla de Ajustes. La elección se guarda en
 * Preferences para recordarla entre sesiones.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly isDark = signal(false);

  async init(): Promise<void> {
    const stored = await Preferences.get({ key: THEME_KEY });
    this.apply(stored.value === 'dark');
  }

  async toggle(): Promise<void> {
    await this.setDark(!this.isDark());
  }

  async setDark(dark: boolean): Promise<void> {
    this.apply(dark);
    await Preferences.set({ key: THEME_KEY, value: dark ? 'dark' : 'light' });
  }

  private apply(dark: boolean): void {
    this.isDark.set(dark);
    document.documentElement.classList.toggle('ion-palette-dark', dark);
    void this.syncStatusBar(dark);
  }

  /**
   * Mantiene la barra de estado de Android en línea con el tema en vez del
   * morado/índigo por defecto de Capacitor. `setStyle` (color de los iconos)
   * funciona en cualquier versión de Android; `setBackgroundColor` y
   * `setOverlaysWebView` dejan de tener efecto en Android 15+ (edge-to-edge
   * obligatorio), así que los llamamos igualmente para versiones anteriores
   * pero sin depender de ellos — silenciamos cualquier error.
   */
  private async syncStatusBar(dark: boolean): Promise<void> {
    if (!Capacitor.isNativePlatform()) return;
    try {
      await StatusBar.setStyle({ style: dark ? Style.Dark : Style.Light });
      await StatusBar.setOverlaysWebView({ overlay: false });
      await StatusBar.setBackgroundColor({ color: dark ? STATUS_BAR_BG_DARK : STATUS_BAR_BG_LIGHT });
    } catch {
      // Plataforma sin soporte (o Android 15+ ignorando color/overlay) — no es un error real.
    }
  }
}
