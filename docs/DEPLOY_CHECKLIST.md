# Checklist para publicar Sendero Épico en Google Play

Todo lo que hace falta para pasar de "APK de prueba" a "app publicada", en orden. Los archivos de apoyo (gráficos, textos) están en `store-assets/` en la raíz del proyecto.

## 1. Cuenta de Google Play Console

Ya tienes cuenta ✅. Si alguna vez hay que crear otra: [play.google.com/console](https://play.google.com/console), 25$ de pago único, verificación de identidad que puede tardar unos días.

**Importante — cuentas nuevas (creadas desde noviembre de 2023):** Google obliga a pasar primero por la pista de **pruebas cerradas**, con al menos 12 testers que hayan aceptado la invitación y mantenido la app instalada 14 días seguidos, antes de poder publicar en producción. Si tu cuenta es de las afectadas, cuenta ese tiempo en el calendario — no es algo que se pueda saltar ni acelerar.

## 2. Keystore de firma (una sola vez, para siempre)

El keystore firma cada versión que subas — si lo pierdes, no puedes volver a actualizar esta ficha nunca más. Genéralo tú mismo en tu Mac (así la contraseña no pasa por ningún sitio intermedio):

```bash
keytool -genkeypair -v \
  -keystore ~/sendero-epico-release.jks \
  -alias sendero-epico \
  -keyalg RSA -keysize 2048 -validity 10000
```

Te pedirá una contraseña (elige una fuerte y guárdala en un gestor de contraseñas) y algunos datos de nombre/organización — no importan mucho, ponlos como quieras. Guarda el `.jks` resultante con copia de seguridad en al menos dos sitios (iCloud + gestor de contraseñas, por ejemplo) — no solo en la carpeta del proyecto.

Después:

1. Copia `android/key.properties.example` a `android/key.properties` (ese archivo ya está en `.gitignore`, nunca se sube).
2. Rellena `storeFile`, `storePassword`, `keyAlias` y `keyPassword` con los valores reales.
3. Ya puedes compilar el AAB firmado:

```bash
cd android && ./gradlew bundleRelease
```

El archivo sale en `android/app/build/outputs/bundle/release/app-release.aab` — eso es lo que se sube a Play Console (no el APK).

Cuando subas esta primera versión firmada, Google te ofrecerá activar **Play App Signing**: acéptalo. A partir de ahí, Google guarda la clave de firma definitiva y tu keystore pasa a ser solo la "clave de subida" — si algún día la pierdes, puedes pedir un reset verificando tu identidad, en vez de perder la ficha para siempre.

## 3. Política de privacidad pública

Ya está escrita en `docs/index.html` (español e inglés, con selector). Para publicarla con GitHub Pages:

1. En GitHub, entra al repo → **Settings → Pages**.
2. En "Source", elige **Deploy from a branch**.
3. Rama `main`, carpeta **`/docs`** → **Save**.
4. Al cabo de uno o dos minutos, la página estará en `https://carlosgonzalezuri.github.io/sendero-epico/` — esa es la URL que pones en Play Console en "Política de privacidad".

## 4. Ficha de la Play Store (Presencia en la Store)

Todo el texto listo para copiar/pegar está en `store-assets/listing-copy.md` (descripción corta y completa, español e inglés, ya verificado que cumplen los límites de caracteres de Google).

Gráficos listos en `store-assets/`:
- `play-store-icon-512.png` — icono de alta resolución (512×512).
- `play-store-feature-graphic-1024x500.png` — gráfico de cabecera de la ficha.
- `screenshots/` — 6 capturas reales de la app (claro/oscuro, español/inglés) a 1080×2280, listas para subir tal cual.

Aún haría falta, si quieres pulirlo más adelante: un vídeo promocional (opcional) y capturas de tablet (opcional, solo si la app se ve bien en pantallas grandes — no la hemos probado ahí).

## 5. Formulario "Seguridad de los datos"

Chuleta completa en `store-assets/data-safety-notes.md`. Resumen: no se recopila ni comparte nada fuera del dispositivo; los pasos de Health Connect se procesan solo localmente. Ojo al aviso sobre el formulario aparte que Google pide específicamente para permisos de Health Connect — puede añadir tiempo de revisión.

## 6. Clasificación de contenido, precio y distribución

- Precio: gratis, con hueco para compras dentro de la app más adelante (aún no implementadas).
- Sin anuncios, sin compras activas todavía, no dirigida a niños.
- Categoría sugerida: Salud y bienestar (o Estilo de vida).
- Cuestionario de clasificación de contenido: rellénalo tú en la consola — con el contenido actual (temática de aventura fantástica solo en texto, sin imágenes violentas) debería salir en la categoría más baja.

## 7. CI de release (opcional, para no compilar el AAB a mano cada vez)

En `.github/workflows/android-build.yml` hay un job de "AAB release firmado" comentado. Para activarlo:

1. Codifica el keystore en base64: `base64 -i ~/sendero-epico-release.jks | pbcopy`.
2. En GitHub → repo → Settings → Secrets and variables → Actions, crea 4 secretos: `ANDROID_KEYSTORE_BASE64` (lo que copiaste), `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS`, `ANDROID_KEY_PASSWORD`.
3. Descomenta el bloque correspondiente en el workflow.

## 8. Subir y publicar

1. Play Console → tu app → **Producción** (o **Pruebas cerradas** primero, si tu cuenta lo exige) → **Crear nueva versión**.
2. Sube el `.aab`.
3. Rellena notas de la versión (qué cambia).
4. Revisa que la ficha, la clasificación de contenido, la política de privacidad y el formulario de datos estén todos en verde antes de enviar a revisión.
5. La primera revisión de Google puede tardar de horas a unos pocos días — más si hay permisos sensibles como Health Connect de por medio.
