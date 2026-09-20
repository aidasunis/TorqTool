# TORQ

Landing page de TORQ, una encintadora inalámbrica para mazos de cables pensada para mecánicos y
electricistas automotrices. El sitio reserva lugares para el primer lote de producción y mide el
interés del mercado antes de fabricar.

## Stack

- React 19 + Vite
- Tailwind CSS v4
- Framer Motion

## Cómo correrla

```bash
npm install
npm run dev
```

Abre `http://localhost:5173`.

## Estructura

- `src/App.jsx` — layout general: header, secciones y footer.
- `src/components/` — el hero (galería de video/imagen), la sección de beneficios, los testimonios,
  el formulario de reserva y las redes sociales.
- `src/lib/` — lógica de métricas y el envío del formulario.
- `public/` — video, imágenes y frames usados en el sitio.

## Conectar el formulario

Las reservas se guardan localmente en el navegador. Para que también lleguen por correo:

1. Crea una cuenta gratis en [formspree.io](https://formspree.io) y un formulario nuevo.
2. Copia `.env.example` a `.env` y pega ahí la URL que te da Formspree.
3. Reinicia `npm run dev`.

`.env` no se sube al repositorio.

## Build de producción

```bash
npm run build
```
