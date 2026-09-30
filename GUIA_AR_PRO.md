# AR Pro — guía de campo (Android + Chrome)

**Requisitos:** Android compatible con ARCore, «Servicios de Google Play para RA» instalado (Play Store) y la app abierta desde **https** (Netlify). En iPhone solo funciona el AR básico.

## Procedimiento
1. Carga el proyecto y entra a **AR**. Si tienes GPS y brújula calibrada, la vista entra aproximada.
2. En ⚙ escribe **Estaca A** y **Estaca B**: abscisa y lateral (+ Der / − Izq) de dos estacas replanteadas, idealmente a **20–50 m** entre sí.
3. Toca **🚀 AR Pro** y mueve el celular despacio apuntando al piso hasta que aparezca el **anillo rosado** (piso detectado).
4. Pon la **cruz** sobre la base de la estaca A, a menos de 8 m, y toca **Capturar A**.
5. Camina a B y haz lo mismo con **Capturar B**. Queda **✓ Fijo A–B** con la diferencia de distancia en cm.
   - Si B está lejos (30 m o más) y no quieres caminar: desde A pon la cruz sobre B y toca **🎯 Apuntar a B**. Es menos preciso: cada 1° de puntería da 1° de giro.
6. Para avanzar por la vía: B queda como nueva A. Cada ~100 m captura la siguiente estaca como B.

## Qué esperar
- Cerca de las estacas: ±0,2–0,5 m. Se degrada ~1–2 % de lo que camines sin re-capturar.
- La vía no se oculta detrás de personas o vehículos: siempre se dibuja encima.
- Si aparece **«Seguimiento perdido»**: poca luz, movimiento brusco o superficie lisa. Muévete despacio apuntando a zonas con textura.
- **«A–B no cuadra»**: la distancia medida no coincide con el diseño. Revisa la abscisa, el lateral o que la estaca sea la correcta. Si estás seguro, un segundo toque la aplica igual.
- **«Δ GPS»** grande en pantalla: posible deriva o estaca equivocada. Re-captura A.
- Al salir de AR Pro la alineación se pierde: hay que capturar de nuevo.
- **🚩 Marcar** dentro de AR Pro marca el punto donde apunta la cruz, con su cota medida (`cota_ar`). Para marcar con foto, sal de AR Pro.
