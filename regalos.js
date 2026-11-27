/* Edita este archivo para personalizar cada regalo. La fecha usa el reloj del dispositivo. */
const CALENDARIO = {
  anio: 2026,
  regalos: [
    {
      titulo: 'Una invitación dulce',
      firma: false,
      boleto: {
        categoria: 'Krispy Kreme · invitación',
        evento: 'Un frappé',
        promesa: 'Tú eliges el sabor.',
        fecha: '1 de diciembre de 2026',
        hora: '',
        lugar: 'Krispy Kreme',
        codigo: 'FRAPPÉ · 01',
        sello: '1 frappé ♡',
        tema: 'frappe',
        ilustracion: 'assets/frappe-caramelo.webp',
        archivoPNG: 'assets/boleto-frappe.png'
      }
    },
    {
      tipo: 'carta',
      apertura: 'regalo',
      tema: 'clasica',
      titulo: 'Carta para mi amor',
      mensaje: `Hola, mi amor:

Espero que te la hayas pasado increíble en tu cumpleaños. Perdón por no darte tantos regalos ni tantos detalles como tú me diste a mí. Quiero que sepas que todo lo hice de corazón, aunque algunas cosas te las dí medio rapido, jajaja.

Quiero que sepas que me enorgullece mucho lo fuerte que eres y cómo todos los días tratas de estar con la mayor energía posible, a pesar de todo lo que llevas encima. Sé que son tiempos complicados, como todo en la vida. Hay subidas y bajadas, pero siempre, siempre se vuelve a subir. Quiero que sepas que siempre estaré aquí para subir a tu lado y apoyarte en todo lo que esté a mi alcance, para que seas siempre la más feliz.

No todo es perfecto y también tenemos bajas, como en todo, pero yo te amo en todo momento y, cuando hay dificultades, te amo más.

Espero que te guste mucho este último regalo que preparé para ti y que todo salga como lo tengo planeado, porque planear regalos durante un mes está medio complicado, jajaja.

Quiero que sepas que te amo y que soy el más feliz a tu lado.

¡Feliz cumpleaños, mi vida! Que celebremos este y muchos más juntos.

Con todo mi amor,`
    },
    {
      tipo: 'secreto',
      titulo: 'REGALO SECRETO',
      notaSecreto: false
    },
    { tipo: 'mono', titulo: 'Un moño para ti', mensaje: 'Se cuanto te gusta usarlos y es una parte de ti que me gusta mucho y destaca lo bella que eres ♡' },
    {
      tipo: 'ilustracion', tema: 'merienda', titulo: 'Un helado',
      mensaje: 'Hoy iremos por un helado a donde tu me digas, te amo ♡',
      imagen: 'assets/regalos/helado.webp', descripcionImagen: 'Dos bolas de helado en un cono de barquillo'
    },
    {
      titulo: 'Un facial hecho por mi',
      mensaje: 'Hoy vamos a prepararte un facial con un poquito de tu ayuda nada más para no regarla. Vamos a casita ♡',
      boleto: {
        categoria: 'Spa para ti · invitación',
        evento: 'Un facial hecho por mi',
        promesa: '',
        fecha: '6 de diciembre',
        hora: '',
        lugar: 'Nuestra casita',
        codigo: 'PARA TI · 06',
        sello: 'Para consentirte ♡',
        tema: 'facial',
        ilustracion: 'assets/facial-spa.webp',
        archivoPNG: 'assets/boleto-facial.png'
      }
    },
    // 7 · Lunes
    {
      tipo: 'vale',
      apertura: 'regalo',
      firma: true,
      boleto: {
        categoria: 'Vale de cita', sello: 'Para dos', evento: 'Una cita en Rebel Wings',
        promesa: '',
        fecha: 'Lunes 7 de diciembre', hora: '10:00 PM', lugar: 'Rebel Wings',
        codigo: 'REBEL · 07', tema: 'rebel', ilustracion: 'assets/regalos/alitas.webp',
        archivoPNG: 'assets/regalos/vale-rebel.png'
      }
    },
    // 8 · Martes
    {
      tipo: 'calendario', anio: 2027, aniversario: 23, titulo: 'Nuestro 2027',
      mensaje: 'Te hice un calendario personalizado para todo nuestro 2027, como el de las carnicerias Jajajaja ♡'
    },
    // 9 · Miércoles
    {
      tipo: 'vale',
      apertura: 'regalo',
      firma: true,
      boleto: {
        categoria: 'Vale de regalo',
        sello: 'Una Coca-Cola ♡',
        evento: 'Una Coca-Cola para ti',
        promesa: 'Se cuanto te gusta la coca pero si no te la quieres tomar se la puedes dar a tu novio ♡',
        fecha: '9 de diciembre',
        hora: '',
        lugar: 'Donde tú quieras',
        codigo: 'COCA · 09',
        tema: 'coca',
        ilustracion: 'assets/regalos/coca-cola.webp',
        archivoPNG: 'assets/regalos/vale-coca.png'
      }
    },
    // 10 · Jueves
    {
      tipo: 'ilustracion', tema: 'merienda', titulo: 'Bolitas de dona',
      mensaje: 'Hoy de regalo son unas bolitas de dona que tanto nos gustan por nuestra casa.',
      imagen: 'assets/regalos/bolitas-de-dona.webp', descripcionImagen: 'Un cucurucho de papel con bolitas de dona espolvoreadas con azúcar'
    },
    // 11 · Viernes
    {
      tipo: 'ilustracion', tema: 'cacao', titulo: 'Chocolate',
      mensaje: 'Un pequeño detalle dulce para ti, espero te guste ♡',
      imagen: 'assets/regalos/chocolate.webp', descripcionImagen: 'Una tableta de chocolate asomándose de su envoltura'
    },
    // 12 · Sábado
    {
      tipo: 'vale',
      apertura: 'regalo',
      boleto: {
        categoria: 'Vale de postre', sello: 'Una porción', evento: 'Fresas con crema',
        promesa: 'Este boleto vale por unas fresas con crema.',
        fecha: 'Sábado 12 de diciembre', hora: '', lugar: 'Tú eliges',
        codigo: 'FRESAS · 12', tema: 'fresa', ilustracion: 'assets/regalos/fresas.webp',
        archivoPNG: 'assets/regalos/vale-fresas.png'
      }
    },
    // 13 · Domingo
    {
      tipo: 'vale',
      apertura: 'regalo',
      boleto: {
        categoria: 'Vale de licuado', sello: '', evento: 'Un herbalife',
        promesa: 'Este boleto vale por un herbalife',
        fecha: 'Domingo 13 de diciembre', hora: '', lugar: 'Herbalife',
        codigo: 'LICUADO · 13', tema: 'batido', ilustracion: 'assets/regalos/licuado.webp',
        archivoPNG: 'assets/regalos/vale-licuado.png'
      }
    },
    // 14 · Lunes
    {
      tipo: 'ilustracion', tema: 'tocador', titulo: 'Tu rutina de skincare',
      mensaje: 'Hoy te pago la rutina que te compraste hace poco, como regalo de cumpleaños espero te sirva mucho, te amo ♡',
      imagen: 'assets/regalos/skincare.webp', descripcionImagen: 'Un gotero de vidrio ámbar junto a un tarrito de crema'
    },
    // 15 · Martes
    {
      tipo: 'ilustracion', tema: 'recuerdo', titulo: 'Llavero',
      mensaje: 'Un lindo llavero para ti espero te guste, te amo ♡',
      imagen: 'assets/regalos/llavero.webp', descripcionImagen: 'Un llavero con un dije de corazón y una pieza azul'
    },
    // 16 · Miércoles
    {
      tipo: 'itinerario', apertura: 'regalo', titulo: 'Dia libre',
      mensaje: 'Hoy la pasamos juntos lo más lejos del trabajo posible, te amo ♡',
      planes: [
        { momento: 'Temprano', nombre: 'Avengers: Doomsday', detalle: 'Empezamos el día juntos en el cine.' },
        { momento: 'Por la noche', nombre: 'Siddhartha en concierto', detalle: 'Terminamos la noche cantando juntos.' }
      ]
    },
    // 17 · Jueves
    { tipo: 'secreto', titulo: 'REGALO SECRETO', notaSecreto: false },
    // 18 · Viernes
    {
      tipo: 'ilustracion', tema: 'cacao', titulo: 'Chocolate',
      mensaje: 'Un pequeño detalle dulce para ti, espero te guste ♡',
      imagen: 'assets/regalos/chocolate.webp', descripcionImagen: 'Una tableta de chocolate asomándose de su envoltura'
    },
    // 19 · Sábado
    { tipo: 'carlota', titulo: 'Una carlota para ti', mensaje: 'El regalo de hoy es una deliciosa carlota preparada por mi llegando a nuestra casita, te amo ♡' },
    // 20 · Domingo
    {
      tipo: 'ilustracion', tema: 'mesa', titulo: 'Carnita asada',
      mensaje: 'Hoy comemos carnita asada con tu familia, se las debía ya',
      imagen: 'assets/regalos/carne-asada.webp', descripcionImagen: 'Tacos de carne asada con guacamole y limón'
    },
    // 21 · Lunes
    {
      tipo: 'ilustracion', tema: 'merienda', titulo: 'Nuestro combo de Burger King',
      mensaje: 'Como cuando al inicio una de nuestras primeras citas fue ir a comer papas con helado, planes sencillos que me hicieron enamorarme de ti ♡',
      imagen: 'assets/regalos/papas-con-helado.webp', descripcionImagen: 'Papas a la francesa junto a un vasito de helado de vainilla'
    },
    // 22 · Martes
    {
      tipo: 'ilustracion', tema: 'tocador', titulo: 'Un perfume',
      mensaje: 'Hoy te traigo un perfume para que huelas tan rico como siempre',
      imagen: 'assets/regalos/perfume.webp', descripcionImagen: 'Un frasco de perfume de cristal con reflejos rosados'
    },
    // 23 · Miércoles
    {
      tipo: 'ilustracion', tema: 'flores', titulo: 'Flores',
      mensaje: 'Por 1 mes más a tu lado, se cuanto amas las flores y cuanto las cuidas que hoy quiero darte un ramo más por nuestro amor ♡',
      imagen: 'assets/regalos/ramo.webp', descripcionImagen: 'Un ramo de flores rosas y blancas envuelto en papel con un listón'
    },
    // 24 · Jueves
    {
      tipo: 'ilustracion', tema: 'navidad', titulo: 'Casa de jengibre',
      mensaje: 'Hoy armamos nuestra casita de jengibre en la noche, te amo ♡',
      imagen: 'assets/regalos/casa-jengibre.webp', descripcionImagen: 'Una casita de jengibre con el techo decorado con glaseado'
    },
    // 25 · Viernes
    {
      tipo: 'ilustracion', tema: 'navidad', titulo: 'Peluche',
      mensaje: 'Feliz navidad amor. Tu regalo de navidad es un peluche y si mis calculos no me fallan (porque esto se hizo en noviembre) el peluche es de jorge el curioso, si no te lo debo de todas maneras, te amo ♡',
      imagen: 'assets/regalos/peluche.webp', descripcionImagen: 'Un osito de peluche con un moño azul'
    }
  ]
};
