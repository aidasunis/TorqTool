# TORQ — Landing de validación (MVP)

Landing en React + Vite + Tailwind para probar 3 hipótesis de riesgo de TORQ (encintadora
inalámbrica de mazos de cables) antes de fabricarla, según el marco de *Innovation Accounting*
de Eric Ries (*The Lean Startup*, cap. 5 "Leap" y cap. 7 "Measure").

## Cómo correrla

```bash
npm install
npm run dev
```

Abre `http://localhost:5173`.

## Qué mide

| Hipótesis | Métrica | Dónde se captura |
|---|---|---|
| **Valor**: el problema (encintar a mano) duele lo suficiente como para pagar por resolverlo | Tasa de conversión visitante → reserva | `src/lib/metrics.js` → `trackVisit()` en cada carga (`App.jsx`) vs. envíos del formulario |
| **Precio**: el mercado pagaría un depósito para reservar el primer lote | % de reservas que marcan "Sí, pagaría un depósito" | Campo `depositoDispuesto` en `ValidationForm.jsx` |
| **Crecimiento**: redes sociales / boca a boca son un canal viable de adquisición | Canal de origen dominante de las reservas | Campo `canal` (Instagram, TikTok, Facebook, WhatsApp, Google, Otro) |

Las 3 se calculan en `computeMetrics()` (`src/lib/metrics.js`) y se pueden ver en vivo dando clic
en **"Ver panel de validación (demo)"** después de enviar el formulario.

## Dónde vive la data

Cada reserva se guarda en dos lados:

1. **`localStorage`** del navegador — siempre, pase lo que pase. Es lo que alimenta el panel de
   validación (`computeMetrics()` en `src/lib/metrics.js`).
2. **Formspree** — si configuraste el endpoint, la reserva también se envía por POST y te llega
   por correo de verdad. Si NO lo configuraste, el formulario sigue funcionando (modo demo:
   solo local) pero el panel de métricas te avisa que falta conectarlo.

**Para conectar Formspree (así el "te vamos a contactar" del mensaje de gracias es cierto):**

1. Ve a [formspree.io](https://formspree.io) y crea una cuenta gratis (hasta 50 envíos/mes).
2. Crea un formulario nuevo — te da una URL tipo `https://formspree.io/f/xxxxabcd`.
3. Copia `.env.example` a `.env` (mismo nivel que `package.json`) y pega esa URL en
   `VITE_FORMSPREE_ENDPOINT`.
4. Reinicia `npm run dev` (Vite solo lee `.env` al arrancar). Listo — cada reserva real te llega
   a la bandeja que registraste en Formspree.

`.env` está en `.gitignore`: no se sube a GitHub. Si despliegas en Vercel/Netlify, agrega la misma
variable (`VITE_FORMSPREE_ENDPOINT`) en su panel de "Environment Variables".

La forma del objeto que se envía: `{ nombre, contacto, rol, rolOtro, metodoActual,
depositoDispuesto, montoDeposito, montoOtro, canal, canalOtro }`. Los campos `rolOtro`,
`montoOtro` y `canalOtro` son opcionales — aparecen solo cuando el visitante elige "Otro" en su
respectivo campo, y no bloquean el envío si los deja vacíos (son para entender mejor a quién
responde "Otro", no un requisito).

## Estructura

- `src/App.jsx` — el logo "TORQ." del header hace scroll de vuelta al inicio de la página al hacer
  clic (`window.scrollTo({top: 0, behavior: 'smooth'})`), en vez de depender de la navegación nativa
  del navegador por `href="#inicio"` (que en algunos entornos no dispara el scroll automático al
  cambiar el hash) — así funciona de forma consistente sin importar el navegador.
- `src/components/HeroCarousel.jsx` — el hero principal: una **galería a pantalla completa de 3
  diapositivas**, estilo DeWalt/Makita. Diapositiva 1: el video real del ensamblaje
  (`public/torq-mecanismo.mp4`) de fondo (`muted playsInline`, `object-cover`, sin bordes ni
  controles) con el wordmark TORQ, eslogan, subtítulo, CTA y badges de confianza superpuestos y
  **alineados a la izquierda** (antes centrados) sobre un scrim degradado. Diapositiva 2: la imagen
  de concepto (`src/assets/torq-lifestyle.webp`) con el titular "Hecha para el taller real, no para
  la vitrina." Diapositiva 3: un video real de un mazo ya encintado (`public/torq-harness.mp4`,
  material de stock) con el titular "Un acabado limpio, listo para instalar."

  **Título más grande en pantallas anchas**: el wordmark TORQ y el eslogan usan
  `text-[clamp(...)]` en vez de un tamaño fijo (`sm:text-[6rem]`) — antes, pasado el breakpoint `sm`
  (640px) el tamaño quedaba congelado sin importar qué tan ancho fuera el monitor, por eso se veía
  chico comparado con un sitio como DeWalt en una pantalla grande. `clamp(4.5rem, 9vw, 10rem)` crece
  con el ancho de la ventana (como `18vw` ya hacía en mobile) hasta un techo de `10rem`, así que en
  un monitor de escritorio se ve notablemente más grande sin volverse gigante en uno ultra-wide. El
  margen entre "TORQ" y "ENCINTA. SUELTA." también pasó de un `mt-3` fijo (12px) a algo que crece con
  el texto (`mt-[4vw]`/`clamp`) — con el título ya mucho más grande, ese espacio fijo se quedaba
  corto y la cola de la "Q" terminaba tapada por el chip amarillo de "SUELTA", pareciendo "TORO".

  **Controles de navegación al estilo DeWalt** (abajo a la izquierda): flechas `‹` `›` para ir a la
  diapositiva anterior/siguiente, los números `1` `2` `3` (el activo en blanco/negrita, con una
  barrita naranja debajo que se llena de izquierda a derecha mostrando cuánto falta para que avance
  sola), y un botón de pausa/play redondo al final — pausa detiene el avance automático **y** el
  video que esté sonando de fondo (no solo el cronómetro), y el botón cambia a ícono de play para
  reanudar exactamente donde quedó. Todo el avance automático y la barra de progreso corren con un
  solo `requestAnimationFrame`, guardando el tiempo transcurrido en un ref para que pausar/reanudar
  no reinicie el progreso de la diapositiva actual.

  Respeta `prefers-reduced-motion`: si está activado, arranca en pausa — nada se reproduce ni avanza
  solo hasta que el visitante mismo le da play con el botón.

  **Detalle técnico no obvio (`<video>`)**: usan un *callback ref* (`setVideoRef`) en vez de un
  `useEffect` normal para llamar `.play()` — se dispara exactamente cuando React monta el nodo real,
  sin depender de un ciclo de render adicional donde la ref todavía podría estar en `null`.

  **Bug real encontrado y corregido — `AnimatePresence` no actualizaba el contenido**: la primera
  versión envolvía cada diapositiva en `<AnimatePresence mode="wait">` para animar la entrada/salida.
  Al navegar manualmente (flechas o números) el estado de React sí cambiaba correctamente
  (confirmado con logs), pero el DOM se quedaba mostrando la diapositiva **anterior**, congelada en
  su valor `initial` (`opacity: 0`) — reproducible siempre, no solo en dev, también en un build de
  producción servido con `vite preview` (o sea que un visitante real lo habría sufrido igual). Pasa
  lo mismo en `SocialProof.jsx`. La causa parece ser un problema de `framer-motion@13.4.0` con
  `AnimatePresence` cuando el hijo directo cambia entre ramas de JSX distintas con `key` dinámico —
  quitar `AnimatePresence` (y las props `exit`) y dejar solo `initial`/`animate` en un
  `motion.div`/`motion.figure` normal lo resuelve por completo: la diapositiva nueva entra con fade,
  la anterior desaparece de golpe al desmontarse (sin fundido de salida, pero sin el bug). Si en
  algún momento actualizas `framer-motion` a una versión mayor, vale la pena volver a probar
  `AnimatePresence` para recuperar el fundido de salida.

  Este componente reemplaza tres secciones que antes vivían por separado: el Hero estático
  (`Hero.jsx`), el video de "cómo funciona" (`MechanismVideo.jsx`) y la sección de imagen de concepto
  (`ImageMoment.jsx`) — los tres archivos siguen en el repo por si quieres volver a la versión
  no-carrusel, pero ya no los importa `App.jsx`.
- `src/components/ScrollHero.jsx` + `src/components/FrameSequence.jsx` — una versión anterior del
  hero: scrollytelling a pantalla completa con el ensamblaje como fondo de video, controlado por
  `scrollYProgress`. Se retiró de `App.jsx` (se sentía poco profesional forzado como primera
  impresión) pero el componente sigue disponible por si quieres volver a él o reusar la técnica de
  scroll-scrubbing en otra parte. `FrameSequence` dibuja `public/frames/frame_NNN.webp` (154 frames)
  en un `<canvas>` — la misma técnica de Apple/Stripe para scroll-scrubbing fluido — y también es lo
  que generó el poster (`frame_140.webp`) que usa el video de `HeroCarousel`.
- `src/components/HeroVideo.jsx` — una versión aún más antigua del hero (`<video>` con canal alfa)
  que tampoco está enganchada pero queda disponible.
- `src/components/Reveal.jsx` — wrapper de Framer Motion para las animaciones de aparición al
  hacer scroll, usado en Hero, Hipótesis, Prueba social, Formulario y Footer.
- `src/components/HypothesisSection.jsx` — sección de 3 tarjetas de beneficio (Corte integrado, 100%
  inalámbrica, Lugar asegurado). Antes decía explícitamente "Hipótesis de valor/precio/crecimiento" y
  "Métrica: ..." en la página — se quitó ese lenguaje académico después de revisar las landings de
  compañeros de clase (Capsulink, Nayrax) y de fabricantes reales (DeWalt, Makita): ninguno expone al
  visitante que está "probando hipótesis" o "midiendo métricas"; lo miden por detrás, a través de lo
  que piden en su formulario. Acá pasa lo mismo — **la medición real no cambió**, sigue viviendo en
  los mismos campos del formulario (`depositoDispuesto`, `canal`, `metodoActual`) y en
  `computeMetrics()`; solo se dejó de explicárselo al visitante en el texto de la página. El nav del
  header también cambió de "Qué validamos" a "Por qué reservar" por la misma razón. Cada tarjeta
  tiene además un ícono propio (`ScissorsIcon`/`BatteryIcon`/`LockIcon`, al final del archivo) — antes
  era solo texto sobre fondo negro, la sección más plana visualmente de toda la página en contraste
  con el resto, muy fotográfico/animado.
- `src/components/SocialProof.jsx` — testimonios, cada uno con **su propia puntuación** (campo
  `rating` en `TESTIMONIALS`, 1-5 estrellas dibujadas en la propia tarjeta). Antes era una grilla
  estática de 3 tarjetas; ahora es un **cascade slider a todo el ancho de la pantalla** (referencia:
  [Cascade-Slider en CodePen](https://codepen.io/ui-kenjie/pen/vYVwBrW)): la tarjeta activa se ve
  nítida y a color, centrada; las vecinas asoman más chicas y en escala de grises a los costados
  (`grayscale`, `scale-90`, `opacity-80`), para que la atención se quede en la que se está leyendo.
  Avanza sola, con los mismos controles y la misma barra de progreso que `HeroCarousel.jsx`
  (números, flechas, pausa/play) — reutiliza a propósito el mismo lenguaje visual para que se sienta
  parte del mismo sitio y no un widget aparte. También se puede hacer clic directo en una tarjeta
  gris del costado para saltar a ella.

  **Loop infinito real**: pasar de la última tarjeta a la primera (o viceversa) no da un salto visual
  — no se calculan posiciones circulares (con solo 3 testimonios, ese cálculo obliga a que alguno
  "viaje" por el camino largo cada cierto número de pasos), sino que se renderizan varias copias
  seguidas de la lista (`CYCLES = 5` en el archivo) y se desliza sobre ellas como una tira normal.
  Cuando el índice se aleja demasiado del "carril" central, se reubica al instante (sin transición)
  en la copia equivalente más cercana — como esa copia tiene exactamente los mismos vecinos
  alrededor, el salto es invisible para quien mira. Verificado haciendo clic en "siguiente"/"anterior"
  muchas veces seguidas sin que se note ningún salto. El posicionamiento centra la tarjeta activa
  usando `left: 50%` (sobre el contenedor recortado, vía `left-1/2` de Tailwind) más
  `translateX(-Xpx)` para desplazarla exactamente el ancho que le falta hasta el centro — sobre un
  ancho de tarjeta fijo (`CARD_WIDTH`/`CARD_GAP` al inicio del archivo). Si agregas más testimonios
  no hace falta tocar nada más de la lógica.

  **Bug real encontrado y corregido — el centrado usaba `50vw`**: la primera versión centraba la
  tarjeta activa con `translateX(calc(50vw - Xpx))`, que asume que la tira ocupa todo el ancho de la
  ventana. Eso dejó de ser cierto en cuanto se agregó la "ventana" recortada (`WINDOW_WIDTH`, ver
  abajo): al estar esa ventana centrada dentro de la página pero ser más angosta que el viewport,
  `50vw` apuntaba al centro de la *pantalla*, no al centro de la *ventana recortada* — la tarjeta
  activa terminaba desplazada hacia la derecha en vez de quedar en el medio (se notó porque en un
  monitor ancho la tarjeta a color aparecía pegada al borde derecho). El truco `left-1/2` +
  `translateX(-Xpx)` resuelve esto porque `left: 50%` siempre se calcula contra el contenedor real
  (la ventana recortada), sin importar qué tan angosta sea ni qué tan ancha sea la pantalla.

  La tira en sí no tiene límite de ancho — lo que sí lo tiene es la "ventana" que la recorta: un
  contenedor `overflow-hidden` centrado con `max-width: WINDOW_WIDTH` (también al inicio del
  archivo). Sin ese límite, en un monitor ancho se alcanzaban a ver 6-7 tarjetas de golpe, lo cual se
  sentía saturado — `WINDOW_WIDTH` está calibrado para que se vean unas 3 sin importar qué tan ancha
  sea la pantalla del visitante.
- `src/components/ValidationForm.jsx` — el formulario y el panel de métricas. El grupo "¿Pagarías
  un depósito?" usa `<input type="radio">` reales (componente `RadioPill`, visualmente igual a los
  demás botones tipo pill) en vez de botones sueltos — si el visitante no elige ninguno, el
  navegador bloquea el envío y muestra su propio mensaje de validación (nativo, accesible,
  traducido automáticamente), en vez de fallar en silencio. El placeholder de "WhatsApp o email"
  tenía formato de teléfono mexicano (`+52 55...`) aunque el negocio es peruano — se corrigió a
  formato de Perú (`+51 974 570 476`, el número real del dueño del proyecto). Ojo: el placeholder de
  un `<input>` es texto público — cualquiera que visite la página lo ve, no es un dato privado
  guardado en ningún lado.
- `src/components/SocialLinks.jsx` / `Footer.jsx` — redes sociales, con los links reales de TORQ
  (Instagram, Facebook, X). Ya no incluye TikTok ni WhatsApp — se quitaron junto con los placeholders
  porque esas cuentas no existen todavía; agrégalas de vuelta a `LINKS` cuando las tengas. El footer
  ya no dice "MVP en validación" (era la única marca visible de que esto era un proyecto de clase,
  contradecía el resto del sitio) — ahora solo "Encinta. Suelta. Siguiente. · © 2026". Tiene un
  prop `dark` (usado en el header, que tiene
  fondo negro): sin él, los íconos son borde/color negro sobre el fondo naranja/crema y se ven
  bien; en el header, sin `dark` eran negro-sobre-negro y solo se notaban al pasar el mouse (el
  hover cambia a amarillo). Con `dark`, quedan en blanco/70 en reposo — visibles siempre, no solo
  al hacer hover.
- `src/lib/metrics.js` — toda la lógica de tracking/cálculo de métricas.
- `index.html` — título de pestaña `TORQ — Encintadora Inalámbrica` (ya no dice "MVP — Validación",
  para que se vea como producto terminado) y las meta tags Open Graph/Twitter Card
  (`og:title`, `og:description`, `og:image`, `twitter:card`, etc.) para que al compartir el link en
  WhatsApp/Facebook/X aparezca una vista previa con imagen y no solo texto plano. La imagen es
  `public/og-image.jpg` (1200×630, recortada de `src/assets/torq-lifestyle.webp` con ffmpeg:
  `ffmpeg -i src/assets/torq-lifestyle.webp -vf "scale=1200:-1,crop=1200:630" -q:v 4
  public/og-image.jpg`). Si cambias el dominio de despliegue, `og:image`/`twitter:image` deben ser
  URLs absolutas (ahora mismo son relativas, `/og-image.jpg`, lo cual funciona para desarrollo local
  pero algunos scrapers de redes sociales requieren la URL completa `https://tu-dominio/og-image.jpg`
  — ajústalo cuando tengas el dominio final).

## Stack de animación

`framer-motion` para el scrollytelling y las animaciones de entrada (`Reveal.jsx`, hovers, el
wordmark del header). El paquete `three` + `@react-three/fiber` + `@react-three/drei` +
`@react-three/postprocessing` (que eran para un hero 3D alternativo, `Torq3D.jsx`, jamás enganchado
a `App.jsx`) se desinstalaron — 65 paquetes menos en `node_modules` — y se borró `Torq3D.jsx`, que
sin esas dependencias ya no podía funcionar.

**`prefers-reduced-motion`**: toda la app está envuelta en `<MotionConfig reducedMotion="user">`
(`src/main.jsx`) — si el visitante tiene activada la preferencia de "reducir movimiento" en su
sistema operativo, Framer Motion apaga automáticamente las animaciones de transformación
(fades/slides/scale) en todos los `motion.*` de la página, sin tocar cada componente uno por uno.

**Nota sobre `ScrollHero.jsx`**: todas las propiedades `opacity` (`torqOpacity`, `hintOpacity`,
`productOpacity`, `eyebrowOpacity`, `sloganWrapOpacity`) se calculan a mano
(`lerpRange` + `useState`) en vez de con `useTransform(scrollYProgress, ...)` directo. Ese patrón
directo se quedaba pegado en el primer valor del rango — de forma intermitente y solo para
`opacity` — un comportamiento reproducible de esta versión de Framer Motion (13.4) cuando conviven
varias propiedades `style` motion-driven en el mismo elemento; `scale`, `y`, `x` y `color` sí se
actualizaban bien con `useTransform` directo, así que esos se dejaron como estaban. Calcular la
interpolación en JS y aplicarla vía estado de React lo evita por completo. Si migras Framer Motion
a una versión mayor, vale la pena volver a probar el patrón directo con `useTransform`.

## Video de la diapositiva 3 (`torq-harness.mp4`)

Material de stock (`Herramienta/6079428-uhd_3840_2160_24fps.mp4`, 3840×2160 @ 24fps, ~30MB) —
transcodificado a 1920px de ancho, sin audio, para que pese lo razonable en la web:

```bash
ffmpeg -i "Herramienta/6079428-uhd_3840_2160_24fps.mp4" \
  -vf "scale=1920:-2" -an -c:v libx264 -crf 22 -preset medium -movflags +faststart \
  public/torq-harness.mp4
```

`public/harness-poster.jpg` es un frame del segundo 8 del propio video ya transcodificado
(`ffmpeg -ss 8 -i public/torq-harness.mp4 -frames:v 1 -vf "scale=1200:-1" harness-poster.jpg`).

## Regenerar la secuencia de frames

Los frames en `public/frames/` salen del MP4 de SolidWorks **con su fondo original intacto** (sin
chroma-key) — el video se reproduce a pantalla completa como fondo del hero (`fit="cover"` en
`FrameSequence`), con un scrim oscuro encima para que el texto se lea. Fuente actual: `Video06.mp4`
(2560×1440 @ 40fps, fondo oscuro con degradado — por eso se funde sin costura con el negro fijo del
hero). Para regenerar con una exportación nueva:

```bash
ffmpeg -i "ruta/a/tu/Ensamblaje.mp4" \
  -vf "fps=11,scale=1920:-1" \
  -c:v libwebp -lossless 0 -quality 93 -compression_level 6 \
  public/frames/frame_%03d.webp
```

En SolidWorks, en el diálogo "Guardar animación en archivo": Tipo → **Archivo de video MP4
(*.mp4)** (nunca Video Flash `.flv`). `scale=1920` y `-quality 93` están puestos altos a propósito
para conservar nitidez (154 frames ≈ 13MB en total); si el peso te preocupa más que la nitidez,
baja `scale` a 1400 y/o `-quality` a 85.

El filtro `fps=11` submuestrea el video de origen a 11 cuadros por segundo antes de exportar — no
hace falta un frame por cada uno del video original (a 40fps sin este filtro serían más de 500
imágenes). Ajusta ese número si quieres más o menos fluidez a cambio de más o menos peso de descarga.

Con `fit="cover"`, `FrameSequence.jsx` recorta cada imagen para llenar el contenedor sin dejar
franjas — no importa la proporción del video de origen, siempre tapa el ancho completo. Lo que sí
hay que actualizar siempre al cambiar de video es `FRAME_COUNT` en
`src/components/FrameSequence.jsx` con el número de archivos generados (`ls public/frames | wc -l`).

**Eslogan sobre el video, no sobre un costado**: como el video ahora ocupa toda la pantalla, ya no
hay "costado" libre — el texto (blanco) va encima, abajo, con un scrim (`bg-gradient-to-t
from-black/65 ... to-black/30`) detrás para que siempre se lea sin importar qué haya en esa parte
del video en ese punto del scroll. El scrim se dejó deliberadamente débil y el video lleva un
`filter: contrast(1.18) saturate(1.2) brightness(1.04)` para que no se vea apagado junto al naranja
sólido del wordmark TORQ; el wordmark y el eslogan llevan `text-shadow` para seguir leyéndose con
un scrim tan ligero.

**Sin líneas divisoras entre secciones**: se quitaron todos los `border-b-4`/`border-t-4` que
separaban cada bloque de la landing (header, hero, hipótesis, imagen, prueba social, formulario) —
el corte entre secciones ahora es solo el cambio de color de fondo, sin una línea marcándolo.

**Animaciones de entrada más notorias**: `Reveal.jsx` ahora anima también un `scale` sutil (0.97 →
1) además del fade + slide-up de antes, en todas las secciones que lo usan (Hipótesis, Prueba
social, Formulario, Footer) — un poco más de "pop" al entrar en vista, no solo un fade plano.

**Historial de este hero**: pasó por varias versiones — (1) 3D con Three.js (ya borrado, dependía de
paquetes que se desinstalaron), (2) el render real enmarcado en una tarjeta blanca con borde negro,
(3) transparente (chroma-key) flotando sobre blobs de color con fondo que pasaba de negro a crema,
(4) el mismo flotado pero con el fondo original conservado (sin chroma-key) y el eslogan al costado,
(5) el video a pantalla completa como fondo fijo de scroll, sin blobs, sin tarjeta (`ScrollHero.jsx`,
retirado por sentirse forzado como primera impresión), (6) hero estático + video "cómo funciona" en
su propia sección + imagen de concepto, cada uno como bloque separado de la página, y (7) la actual:
las tres piezas de la versión 6 fusionadas en `HeroCarousel.jsx`, una galería de 3 diapositivas estilo
DeWalt/Makita que avanza sola. Cada versión anterior queda disponible en el repo por si quieres volver
a alguna.

## Pendiente antes de publicar

- Conectar el formulario a un backend real (Formspree) si se va a usar fuera de la demo de clase.
- Sustituir los testimonios de ejemplo por citas reales conforme entren entrevistas/reservas.
