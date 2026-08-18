import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.carlos.senderoepico',
  appName: 'Sendero Épico',
  webDir: 'dist/sendero-epico/browser',
  plugins: {
    StatusBar: {
      // Arranque en claro (coincide con el tema por defecto de ThemeService);
      // ThemeService.syncStatusBar() lo actualiza en caliente si el usuario
      // cambia a oscuro. En Android 15+ overlaysWebView/backgroundColor se
      // ignoran (edge-to-edge obligatorio) y solo importa `style`.
      overlaysWebView: false,
      style: 'LIGHT',
      backgroundColor: '#ffffffff',
    },
  },
};

export default config;
