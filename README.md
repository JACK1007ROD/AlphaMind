# ALPHA MIND CHALLENGE — Sitio Web Oficial
## Estructura del Proyecto

```
evento-deportivo/
│
├── index.html                  ← Página principal (INICIO)
│
├── pages/
│   ├── nosotros.html           ← Historia, misión, visión, fundador
│   ├── cronograma.html         ← Línea de tiempo de 5 fases
│   ├── galeria.html            ← Fotos, videos, testimonios
│   └── inscripciones.html      ← Formulario + categorías + FAQ
│
├── css/
│   └── style.css               ← Todos los estilos (variables, componentes, páginas)
│
├── js/
│   └── script.js               ← Countdown, partículas, scroll reveal, validación
│
├── img/
│   ├── logo-am.png             ← Logo "AM" metálico (Hero de navbar)
│   └── logo-challenge.png      ← Logo completo Alpha Mind Challenge
│
└── videos/
    └── hero-bg.mp4             ← (AGREGAR) Video motivacional para el hero

```

## Paleta de Colores
- Negro profundo: #0A0A0F
- Negro secundario: #14141C
- Rojo Alpha: #C1121F
- Rojo brillante: #FF2E3A
- Plata metálico: #C9CDD3
- Plata oscuro: #8B9098
- Dorado: #D4AF37

## Funcionalidades incluidas
- ✅ Barra de progreso de scroll (superior)
- ✅ Navbar fija, transparente → oscura al scroll, responsive con hamburger
- ✅ Hero con video de fondo + partículas animadas
- ✅ Contador regresivo en tiempo real (apunta al 22/08/2025)
- ✅ Animaciones de scroll reveal (data-reveal / data-delay)
- ✅ Carrusel infinito de patrocinadores
- ✅ Grid masonry con lightbox en galería
- ✅ Slider automático de testimonios
- ✅ Formulario de inscripción con validación frontend
- ✅ Scroll suave a anclajes
- ✅ Diseño Mobile First / Responsive

## Para personalizar
1. **Video hero**: Agrega `videos/hero-bg.mp4` con tu video motivacional
2. **Fotos galería**: Reemplaza los placeholders en `pages/galeria.html` con `<img src="../img/foto-XX.jpg">`
3. **Patrocinadores**: Reemplaza `.sponsor-placeholder` con logos reales `<img src="../img/logo-sponsor.png">`
4. **Fecha fundador/coach**: Edita la sección en `pages/nosotros.html`
5. **Redes sociales**: Actualiza los `href="#"` en el footer con las URLs reales
6. **Email**: Reemplaza `info@alphamindchallenge.com` con el correo real
