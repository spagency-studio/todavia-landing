# Todavía — contrato de diseño

**Propósito:** persuadir. Una sola acción: comprar la agenda 2027 (USD 9,99). Tráfico móvil desde Instagram/Facebook.

**Composición:** editorial, asimétrica, con mucho aire. Tres bloques: Inspiración → Producto + regalos → Venta. La flor de la portada es el hilo visual: aparece completa en el hero y encuadrada (recortada por el contenedor) en el resto de la página. No hay tarjetas idénticas con sombra: los regalos alternan encuadre de flor, numeral romano y desfase vertical.

**Tipografía:** Cormorant Garamond (títulos; la itálica lleva la voz emocional) + Jost (texto y etiquetas en mayúsculas espaciadas, eco de "A G E N D A" en la portada). Alojadas en `assets/fonts`, `font-display: swap`.

**Color (de la portada):**

| Rol | HEX | Uso | Contraste sobre papel |
|---|---|---|---|
| Papel (fondo) | `#F8EFDE` | fondo general | — |
| Papel profundo | `#F1E4CC` | secciones alternas | — |
| Rubor | `#EFD3BE` | detalles, caja de oferta | — |
| Tinta (azul portada) | `#0B2F63` | títulos | 11,5:1 |
| Texto | `#26344F` | párrafos | 10,9:1 |
| Texto suave | `#5A5F6E` | notas | 5,6:1 |
| Terracota (flor) | `#CE5330` | ilustración, texto ≥ 24 px | 3,75:1 (solo grande) |
| Terracota CTA | `#B13F1D` | botones, acentos pequeños | 5,1:1 · blanco encima 5,8:1 |
| Dorado apagado | `#A88A55` | filetes, ornamentos (no texto) | decorativo |
| Dorado texto | `#7A6236` | numerales y etiquetas | 5,1:1 |

**Responsive:** mobile-first. En 390 px el hero muestra frase, subtítulo y CTA sin scroll, con el mockup asomando debajo. Desde 960 px: dos columnas (texto 7/12, mockup 5/12 desbordando a la derecha). CTA fijo inferior solo en móvil, tras salir del hero y oculto cuando la caja de oferta está en pantalla.

**Estados:** foco visible en todo control; FAQ con `<details>`; precio de lanzamiento que cambia solo a USD 14 a partir del 1/1/2027 (fecha real, sin contador).

**Condición de terminado:** capturas a 390 y 1440 px revisadas; todos los CTA llevan al checkout y disparan `InitiateCheckout`; un solo H1; contraste AA; sin errores de consola.
