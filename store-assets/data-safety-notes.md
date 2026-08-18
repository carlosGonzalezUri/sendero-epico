# Notas para el formulario "Seguridad de los datos" (Play Console)

Esto es una chuleta con lo que sé del comportamiento real de la app, para que rellenes el formulario oficial de Play Console más rápido. El formulario en sí solo se puede rellenar desde la consola (no tengo acceso a él), y su interfaz cambia de vez en cuando — usa esto como guía, no como respuesta literal palabra por palabra.

## Lo que hace la app realmente, en una frase

Sendero Épico lee tu contador de pasos de Health Connect (con tu permiso) y lo guarda **solo en tu dispositivo** (`@capacitor/preferences`, almacenamiento local). No hay servidor, no hay cuenta de usuario, no hay analítica, no hay SDK de anuncios, no se comparte ni se vende nada a nadie.

## Sección "¿Recopila o comparte datos tu app?"

Con la definición de Google (recopilar = transmitir fuera del dispositivo), la respuesta honesta es **no se recopilan ni se comparten datos**, porque nada sale del teléfono. Aun así:

- **Datos de salud y forma física → Pasos**: la app **accede** a esto vía Health Connect y lo **procesa solo en el dispositivo**. Marca la casilla de "procesado efímeramente" / "solo en el dispositivo" si el formulario la ofrece, en vez de "recopilado".
- No hay otras categorías de datos que declarar (ni ubicación, ni contactos, ni identificadores publicitarios, ni info financiera — nada de eso se usa).

## Aviso importante: Health Connect pide su propio formulario aparte

Google trata los permisos de Health Connect como sensibles y, además del formulario general de "Seguridad de los datos", es probable que Play Console te pida rellenar una **declaración específica de permisos de Health Connect** (en "Contenido de la app" o al detectar el permiso `android.permission.health.READ_STEPS` en el manifest). Ahí básicamente tendrás que explicar lo mismo: para qué usas los pasos (gamificación de actividad física) y que no se comparten. Puede tardar algo más en revisarse que una app normal — cuenta con eso en el calendario.

## Cifrado y borrado de datos

- **¿Los datos se cifran en tránsito?** No aplica (no hay tránsito), pero si el formulario obliga a elegir, "Sí" es la opción segura ya que cualquier red que la app pueda usar en el futuro sería HTTPS.
- **¿El usuario puede pedir que se borren sus datos?** Sí — desinstalar la app borra todo, porque todo vive solo en el dispositivo. No hace falta un flujo de borrado remoto porque no hay nada en remoto.
- **¿Revisión de seguridad independiente?** No.

## Otras declaraciones de "Contenido de la app" (fuera de Data Safety)

- **Anuncios**: No, la app no tiene anuncios.
- **Compras dentro de la app**: No, por ahora (dejamos la puerta abierta a funciones premium más adelante — cuando existan de verdad, esto habrá que actualizarlo).
- **App para niños / Familias**: No es una app dirigida a niños.
- **App del gobierno / noticias / rastreo de COVID**: No a las tres.
- **Clasificación de contenido**: el recorrido usa temática de aventura fantástica en texto (nombres de etapas, iconos), sin violencia gráfica ni imágenes explícitas — debería calificar para la categoría más baja (tipo "Para todos los públicos" / PEGI 3), pero el cuestionario oficial de clasificación solo lo puedes rellenar tú dentro de Play Console.
