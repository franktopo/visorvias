# Formato `*_AR.json` — lo que el visor lee

RoadExtract Pro lo genera con `exportarViaAR()`. El visor abre la **versión 1** (la anterior) y la **versión 2** (la corregida). Lo que no venga en el JSON simplemente no se muestra.

## Versión 2 (RoadExtract con `exportarViaAR` v2)

### Geometría
| Campo | Contenido |
|---|---|
| `ribbon.L / C / R` | Borde izq., eje y borde der. `[E,N,Z]` por estación. **Z de los bordes = rasante + peralte × semibanca** (en la v1 salían a la misma cota del eje). Incluyen sobreancho y correcciones de campo (Δd, Δz, Δp). |
| `ribbon.CL / CR` | Pata del chaflán izq./der. `[E,N,Z]` o `null`. Salen del motor único de secciones de RoadExtract (el mismo que dibuja la sección y cubica). Solo si hay terreno/TIN. |
| `abs` | Abscisa **visual** de cada estación: la de las estacas, también con abscisado invertido. Paso `step`; la última estación es siempre el final exacto. |
| `peralteL / peralteR` | Pendiente transversal de cada mitad, en %: − baja hacia afuera, + sube hacia afuera. Bombeo = ambos negativos. |
| `peralte` | = `peralteR`, para compatibilidad con visores v1. |
| `terreno` | Cota del terreno natural en el eje por estación (`null` permitido). Activa corte/relleno. |
| `abscisado` | `"normal"` o `"invertido"`. |

### Alineamiento
| Campo | Contenido |
|---|---|
| `curvas[]` | `id, pi, tipo (Circular/Espiral), R, delta (°), sentido (der/izq en el sentido de abscisas), le, T, Lc, PC, PT, PIabs, PIe, PIn, pMax` · espirales además `TE, EC, CE, ET`. **PC = `pi.abscisa`, PT = PC + Lc, PI = PC + T** (en la v1 el PI salía con la abscisa del PC). |
| `curvasV[]` | `id, PIV, zPIV, PCV, PTV, L, K, gIn, gOut (%), tipo (convexa/cóncava)`. L = \|A\|·100·K, igual que la rasante de RoadExtract. |
| `hitos[]` | PC/PT (o TE/EC/CE/ET) exactos, PI en su vértice y puntos obligados. |

### Obras
| Campo | Contenido |
|---|---|
| `obras[]` | Del motor hidráulico (`_obrasHidraulicasDetectadas`): `id, abs, tipo, dim, prioridad, criterio, causa, e, n, z, norma`. |

### Georreferencia y otros
`crs {epsg, proj}`, `anchor {e,n,z,lat,lon,abs}`, `lane`, `absIni`, `absFin`, `step`, `proyecto`, `generado`, `version: 2`.

`decl` (declinación magnética, grados, + Este) es opcional; si viene, el visor la aplica en el AR básico.

## Versión 1 (compatible)
`ribbon.L/C/R`, `abs`, `peralte` (un solo valor), `hitos`, `crs`, `anchor`, `lane`. Sigue abriendo igual; solo no tiene curvas, peralte por lado ni obras.

## Qué hace el visor con cada campo
- **Recorrer:** abscisa, cota, pendiente, peralte izq./der., curva actual ("C1 · R=150 m · Δ 54.3° · der. · PC → PT · e máx") o distancia a la próxima, y curva vertical.
- **Recuadro inferior:** fila "Curva".
- **Color "Por peralte":** inclinación de la calzada (verde = bombeo).
- **Capas:** obras en el mapa y en 3D (se pueden ocultar).
- **Ir a → Saltar a:** lista de curvas (PC/TE) y obras para fijar el objetivo.

## Exportación de puntos marcados (lo que sale del visor)
El ZIP contiene `puntos.csv`, `puntos.geojson`, `puntos.kml` (si hay CRS), `fotos/Pn.jpg` y `LEEME.txt`.

Columnas del CSV (separado por comas, decimal con punto, UTF-8):
`id, tipo, descripcion, abscisa, abscisa_m, lateral_m, lado, este, norte, cota_rasante, cota_terreno, cota_ar, alt_gps, lat, lon, precision_m, muestras, dispersion_m, fuente, fecha, foto`

`este` y `norte` están en el CRS del proyecto, listos para importarlos de vuelta en RoadExtract. `precision_m` es la que reporta el GPS del celular: no es una medición topográfica.

`cota_ar` solo se llena en puntos marcados con AR Pro: es la cota del piso real medida por ARCore. Es relativa a la cota de diseño de las estacas A/B, así que su precisión depende de la alineación.
