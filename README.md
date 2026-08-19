# Sendero Épico

App Ionic + Angular + Capacitor que convierte tus pasos reales (vía Health Connect) en el avance de un viaje de aventura por etapas, con hitos y narrativa. Ver [`BRIEF.md`](./BRIEF.md) para el detalle del producto.

## Desarrollo

```bash
npm install
npm start        # ng serve, http://localhost:4200
```

## Build y ejecución en Android

```bash
npm run build
npx cap sync android
npx cap run android
```

Requiere JDK 21 y el SDK de Android configurados. Ver [`docs/DEPLOY_CHECKLIST.md`](./docs/DEPLOY_CHECKLIST.md) para el proceso completo de publicación en Google Play.

## Tests

```bash
npm test
```
