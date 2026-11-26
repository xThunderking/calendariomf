# mafercember

Calendario de 25 regalos, del 1 al 25 de diciembre, hecho con HTML, CSS y JavaScript. No necesita base de datos, instalaciones ni proceso de compilación.

## Personalizar los regalos

Abre `regalos.js`. El valor `anio` determina el diciembre del calendario; está configurado para 2026. La primera entrada de `regalos` corresponde al día 1, la segunda al día 2 y así hasta el día 25. Cambia los títulos y mensajes de ejemplo por los tuyos, conservando las comillas y las comas.

Cada regalo admite estos campos:

```js
{
  titulo: 'Nuestra canción',
  mensaje: 'Esta canción siempre me recuerda a ti.',
  imagen: 'assets/nuestra-foto.jpg', // opcional
  descripcionImagen: 'Nuestra foto favorita', // opcional
  enlace: 'https://ejemplo.com', // opcional: canción, video o regalo que programes
  textoEnlace: 'Escuchar nuestra canción' // opcional
}
```

Para usar una imagen propia, cópiala dentro de `assets` y escribe su ruta en `imagen`. También puedes enlazar a una página o aplicación propia con una ruta como `./sorpresas/dia-01/index.html`. Los enlaces se abren en una pestaña nueva. Los textos del calendario se pueden cambiar en `index.html`.

Para escribir la carta del día 2, cambia `mensaje: 'Hola'` en la entrada correspondiente de `regalos.js`. Puedes usar un texto entre acentos graves para conservar los saltos de línea.

## Probar

Abre `index.html` en el navegador. Para revisar todos los regalos antes de diciembre, añade `?preview=1` a la dirección. Por ejemplo, `index.html?preview=1`. Comparte el enlace normal. La vista previa guarda su propio progreso. Los regalos abiertos se recuerdan en el navegador en el que se abrieron.

Cada regalo queda disponible a las 12:00 p. m. (mediodía) de su día, según la fecha y hora del dispositivo. Al tocar un regalo antes de esa hora aparece una cuenta regresiva. Los días anteriores permanecen disponibles. Esta restricción es una sorpresa visual, no una medida de seguridad: el contenido forma parte de los archivos públicos y puede consultarse antes, y el modo de vista previa también lo desbloquea. No incluyas secretos ni datos sensibles.

## Publicar en Netlify

1. Entra a Netlify y crea un sitio mediante la opción de despliegue manual (Netlify Drop) o conecta un repositorio Git con estos archivos.
2. Para despliegue manual, arrastra la carpeta del proyecto con `index.html`, `styles.css`, `sorpresas.css`, `app.js`, `regalos.js`, `ticket-image.js`, `netlify.toml` y `assets`. No hace falta subir la carpeta `.git`.
3. Si conectas un repositorio, no configures ningún comando de compilación; el directorio de publicación es la raíz (`.`), como indica `netlify.toml`.
4. Comparte la URL que Netlify te proporcione. Cada vez que cambies un regalo tendrás que volver a desplegar la carpeta o subir los cambios a tu repositorio conectado.

La imagen del encabezado del calendario es `assets/diciembre-azul.webp`. La caja animada usa `assets/regalo-azul.webp` y sus dos partes se separan en `styles.css`.

### Regalos con boletos

Los días 1, 6, 7, 12 y 13 tienen invitaciones que puedes personalizar en el campo `boleto` de `regalos.js`.

```js
boleto: {
  categoria: 'CONCIERTO PARA DOS',
  evento: 'Nuestra noche especial',
  fecha: '18 DIC 2026',
  hora: '8:00 PM',
  lugar: 'Ciudad de México',
  codigo: 'AMOR · 02',
  tema: 'frappe',
  ilustracion: 'assets/frappe-caramelo.webp'
}
```

Cambia cada dato por el plan real. El código de barras es decorativo: estas invitaciones no son entradas oficiales ni sirven para acceder a eventos que requieran boletos válidos.

En los regalos con boleto, **Compartir** ofrece la imagen a las aplicaciones del dispositivo. Si el navegador no puede compartir archivos, copia la imagen o la descarga para que puedas adjuntarla. En la vista previa local y en Netlify, el PNG se genera con el texto de `regalos.js`. Si abres `index.html` directamente como archivo, se descarga la copia indicada en `archivoPNG`.
