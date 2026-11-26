(() => {
  const { anio, regalos } = CALENDARIO;
  const DAY_COUNT = regalos.length;
  const UNLOCK_HOUR = 12;
  const OPENING_DURATION = 950;
  const LETTER_OPENING_DURATION = 1400;
  const preview = new URLSearchParams(location.search).get('preview') === '1';
  const storageKey = `diciembre-contigo-${anio}${preview ? '-preview' : ''}`;
  const decemberStart = new Date(anio, 11, 1);
  const calendarEnd = new Date(anio, 11, DAY_COUNT + 1);
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const giftDateFormat = new Intl.DateTimeFormat('es-MX', { weekday: 'long', day: 'numeric', month: 'long' });
  const monthFormat = new Intl.DateTimeFormat('es-MX', { month: 'long' });
  const envelopes = {
    carta: { label: 'Una carta', action: 'Abrir mi carta' },
    poema: { label: 'Un poema', action: 'Leer mi poema' },
    vale: { label: 'Un boleto', action: 'Abrir mi boleto' },
    itinerario: { label: 'Un plan', action: 'Descubrir nuestro día' }
  };
  const papers = [
    { name: 'sky', ornament: '✧' },
    { name: 'latte', ornament: '✶' },
    { name: 'mist', ornament: '❅' },
    { name: 'ivory', ornament: '✦' },
    { name: 'blush', ornament: '♡' }
  ];
  const states = {
    available: { icon: 'gift', label: 'abrir regalo' },
    opened: { icon: 'heart', label: 'regalo abierto, volver a ver' },
    locked: { icon: 'lock', label: 'regalo por llegar' }
  };

  const byId = id => document.getElementById(id);
  const grid = byId('calendar-grid');
  const status = byId('calendar-status');
  const dialog = byId('gift-dialog');
  const stage = byId('gift-stage');
  const lockedStage = byId('gift-locked');
  const lockedTitle = byId('gift-locked-title');
  const countdownParts = [...lockedStage.querySelectorAll('.countdown-number')];
  const reveal = byId('gift-reveal');
  const unwrap = byId('unwrap-button');
  const giftTitle = byId('gift-title');
  const ticketActions = byId('ticket-actions');
  const ticketDownload = byId('ticket-download');
  const ticketShare = byId('ticket-share');
  const ticketStatus = byId('ticket-action-status');
  const opened = loadOpenedDays();
  const cards = [];
  let selectedDay;
  let revealTimer;
  let countdownTimer;
  let calendarTimer;
  let ticketFile;
  let ticketUrl;
  let ticketExportRequest = 0;

  function loadOpenedDays() {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
      if (Array.isArray(saved)) {
        return new Set(saved.filter(day => Number.isInteger(day) && day >= 1 && day <= DAY_COUNT));
      }
    } catch {
      // El calendario también funciona cuando el navegador no guarda el progreso.
    }
    return new Set();
  }

  function unlockAt(day) {
    return new Date(anio, 11, day, UNLOCK_HOUR);
  }

  function daysAvailable(now = new Date()) {
    if (preview || now >= calendarEnd) return DAY_COUNT;
    if (now < decemberStart) return 0;
    const day = now.getDate();
    return now < unlockAt(day) ? day - 1 : day;
  }

  function buildCalendar() {
    const tiles = document.createDocumentFragment();
    for (let day = 1; day <= DAY_COUNT; day++) {
      const tile = document.createElement('li');
      const card = document.createElement('button');
      const paper = papers[(day - 1) % papers.length];
      card.type = 'button';
      card.className = 'day-card';
      card.dataset.day = day;
      card.dataset.paper = paper.name;
      card.setAttribute('aria-haspopup', 'dialog');
      card.innerHTML = `
        <span class="card-decoration" aria-hidden="true">${paper.ornament}</span>
        <span class="card-indicator" aria-hidden="true"><span class="state-icon"></span></span>
        <span class="card-number">${String(day).padStart(2, '0')}</span>
        <span class="card-memory" hidden></span>
        <span class="card-today" aria-hidden="true" hidden>Hoy</span>
      `;
      tile.append(card);
      tiles.append(tile);
      cards.push(card);
    }
    grid.append(tiles);
  }

  function refreshCalendar() {
    const now = new Date();
    const available = daysAvailable(now);
    const today = now >= decemberStart && now < calendarEnd ? now.getDate() : null;

    if (preview) {
      status.textContent = '';
    } else if (available === 0) {
      status.textContent = 'El primer regalo se abre el 1 de diciembre a las 12:00 p. m.';
    } else if (today) {
      status.textContent = `Hoy es ${today} de diciembre.`;
    } else {
      status.textContent = 'Puedes volver a abrir todos tus regalos.';
    }

    const count = [...opened].filter(day => day <= available).length;
    byId('opened-count').textContent = count;
    byId('progress-bar').value = count;

    cards.forEach((card, index) => {
      const day = index + 1;
      let state = 'available';
      if (day > available) state = 'locked';
      else if (opened.has(day)) state = 'opened';

      card.dataset.state = state;
      card.querySelector('.state-icon').className = `state-icon icon-${states[state].icon}`;
      card.querySelector('.card-today').hidden = day !== today;
      const gift = regalos[index] || {};
      const memory = card.querySelector('.card-memory');
      memory.hidden = state !== 'opened';
      memory.textContent = memory.hidden ? '' : gift.boleto?.evento || gift.titulo || envelopes[gift.tipo]?.label || 'Tu regalo';
      const description = memory.hidden ? states[state].label : `${memory.textContent}, ${states.opened.label}`;
      card.setAttribute('aria-label', `Día ${day} de diciembre, ${description}`);
      if (day === today) card.setAttribute('aria-current', 'date');
      else card.removeAttribute('aria-current');
    });
  }

  function refreshCalendarClock() {
    window.clearTimeout(calendarTimer);
    refreshCalendar();
    updateCountdown();
    // Actualiza la cuadrícula al cambiar el minuto, incluido el mediodía.
    calendarTimer = window.setTimeout(refreshCalendarClock, 60_000 - Date.now() % 60_000);
  }

  function fillTicket(details, day) {
    const ticket = byId('gift-ticket');
    ticket.hidden = !details;
    if (!details) {
      prepareTicketExport();
      return;
    }

    const tones = ['sky', 'latte', 'mist'];
    const copy = {
      category: details.categoria || 'Invitación especial',
      badge: details.sello ?? 'Para dos',
      event: details.evento || 'Nuestra próxima cita',
      promise: details.promesa ?? 'Un momento bonito para compartir.',
      date: details.fecha || 'Por elegir',
      time: details.hora ?? 'Por elegir',
      place: details.lugar || 'Sorpresa',
      code: details.codigo || 'AMOR · ' + String(day).padStart(2, '0')
    };
    ticket.dataset.tone = details.tema || tones[day % tones.length];
    ticket.classList.toggle('has-illustration', Boolean(details.ilustracion));
    byId('ticket-category').textContent = copy.category;
    byId('ticket-promise-badge').textContent = copy.badge;
    byId('ticket-promise-badge').parentElement.hidden = !copy.badge;
    byId('ticket-event').textContent = copy.event;
    byId('ticket-subtitle').textContent = copy.promise;
    byId('ticket-subtitle').hidden = !copy.promise;
    byId('ticket-date').textContent = copy.date;
    byId('ticket-time').textContent = copy.time;
    byId('ticket-time').parentElement.hidden = !copy.time;
    ticket.classList.toggle('without-time', !copy.time);
    byId('ticket-place').textContent = copy.place;
    byId('ticket-code').textContent = copy.code;

    const illustration = byId('ticket-illustration');
    byId('ticket-art').hidden = !details.ilustracion;
    if (details.ilustracion) illustration.src = details.ilustracion;
    else illustration.removeAttribute('src');
    prepareTicketExport(details.archivoPNG, copy, ticket, illustration);
  }

  function prepareTicketExport(fallback, copy, ticket, illustration) {
    const request = ++ticketExportRequest;
    if (ticketUrl) URL.revokeObjectURL(ticketUrl);
    ticketUrl = null;
    ticketFile = null;
    ticketActions.hidden = !fallback;
    ticketShare.disabled = false;
    ticketStatus.textContent = '';
    ticketDownload.removeAttribute('href');
    if (!fallback) return;

    const filename = fallback.split('/').pop();
    ticketDownload.href = fallback;
    ticketDownload.download = filename;

    // Un archivo local no puede usar una foto vecina para exportar un lienzo.
    if (location.protocol === 'file:') return;
    ticketShare.disabled = true;
    ticketStatus.textContent = 'Preparando imagen…';
    const styles = getComputedStyle(ticket);
    const colors = {
      ink: styles.color,
      paper: styles.getPropertyValue('--ticket-paper').trim(),
      border: styles.getPropertyValue('--ticket-edge').trim(),
      accent: styles.getPropertyValue('--ticket-accent').trim(),
      glow: styles.getPropertyValue('--ticket-glow').trim(),
      stub: styles.getPropertyValue('--stub-paper').trim()
    };
    createTicketImage(copy, colors, illustration, filename).then(file => {
      if (request !== ticketExportRequest) return;
      ticketFile = file;
      ticketUrl = URL.createObjectURL(file);
      ticketDownload.href = ticketUrl;
      ticketShare.disabled = false;
      ticketStatus.textContent = '';
    }).catch(() => {
      if (request !== ticketExportRequest) return;
      ticketShare.disabled = false;
      ticketStatus.textContent = '';
    });
  }

  async function shareTicket() {
    const request = ticketExportRequest;
    const file = ticketFile;
    ticketStatus.textContent = '';
    if (file) {
      const data = { files: [file] };
      try {
        if (navigator.share && navigator.canShare?.(data)) {
          await navigator.share(data);
          return;
        }
        if (navigator.clipboard?.write && window.ClipboardItem) {
          await navigator.clipboard.write([new ClipboardItem({ 'image/png': file })]);
          if (request === ticketExportRequest) ticketStatus.textContent = 'Imagen copiada. Pégala en tu chat.';
          return;
        }
      } catch (error) {
        if (error.name === 'AbortError') return;
      }
    }
    if (request === ticketExportRequest) {
      ticketDownload.click();
      ticketStatus.textContent = 'Puedes adjuntar el PNG descargado para compartirlo.';
    }
  }

  function showKeepsakeMonth(gift, month) {
    const first = new Date(gift.anio, month, 1);
    const start = (first.getDay() + 6) % 7; // La semana comienza en lunes.
    const days = new Date(gift.anio, month + 1, 0).getDate();
    const dates = document.createDocumentFragment();
    // Seis filas mantienen los controles en su sitio al cambiar de mes.
    for (let slot = 0; slot < 42; slot += 7) {
      const week = document.createElement('tr');
      for (let column = 0; column < 7; column++) {
        const day = slot + column - start + 1;
        const cell = week.insertCell();
        if (day < 1 || day > days) continue;
        const number = document.createElement('span');
        number.textContent = day;
        if (day === gift.aniversario) {
          number.className = 'anniversary-day';
          const label = document.createElement('span');
          label.className = 'visually-hidden';
          label.textContent = ', otro mes de novios';
          number.append(label);
        }
        cell.append(number);
      }
      dates.append(week);
    }
    const body = byId('keepsake-dates');
    body.replaceChildren(dates);
    if (!reduceMotion.matches && !reveal.hidden) {
      body.animate([{ opacity: .35 }, { opacity: 1 }], { duration: 180 });
    }
    byId('keepsake-month').textContent = monthFormat.format(first);
    const prev = byId('month-prev');
    const next = byId('month-next');
    prev.disabled = month === 0;
    next.disabled = month === 11;
    prev.onclick = () => showKeepsakeMonth(gift, month - 1);
    next.onclick = () => showKeepsakeMonth(gift, month + 1);
  }

  function fillPlans(plans = []) {
    const list = byId('date-plans');
    list.hidden = !plans.length;
    list.replaceChildren();
    for (const plan of plans) {
      const stop = document.createElement('li');
      const when = document.createElement('span');
      const title = document.createElement('h3');
      const note = document.createElement('p');
      when.textContent = plan.momento;
      title.textContent = plan.nombre;
      note.textContent = plan.detalle;
      stop.append(when, title, note);
      list.append(stop);
    }
  }

  function clearPlayer() {
    const slot = byId('gift-player');
    const player = slot.firstElementChild;
    if (player) {
      player.pause();
      player.removeAttribute('src');
      player.load();
      slot.replaceChildren();
    }
  }

  function fillMedia(gift) {
    clearPlayer();
    const isSong = gift.tipo === 'cancion';
    const isVideo = gift.tipo === 'video';
    byId('media-cover').hidden = !isSong && !(isVideo && !gift.video);
    if (!isSong && !isVideo) return;
    const source = isSong ? gift.audio : gift.video;
    if (!source) return;
    const player = document.createElement(isSong ? 'audio' : 'video');
    player.controls = true;
    player.preload = 'metadata';
    player.setAttribute('aria-label', gift.titulo);
    if (isVideo) {
      player.playsInline = true;
      player.poster = 'assets/regalos/fin-de-ano.webp';
    }
    player.src = source;
    byId('gift-player').append(player);
  }

  function fillGift(day) {
    const gift = regalos[day - 1] || {};
    const kind = { carta: 'letter', poema: 'letter', mono: 'bow', secreto: 'secret' }[gift.tipo] || gift.tipo || 'gift';
    const isLetter = kind === 'letter';
    const envelope = gift.apertura === 'regalo' ? null : envelopes[gift.tipo];
    const message = gift.mensaje || '';
    stage.dataset.kind = envelope ? 'letter' : 'gift';
    reveal.dataset.kind = kind;
    reveal.dataset.theme = gift.tema || '';
    reveal.classList.toggle('short-letter', isLetter && /^[^\r\n]{1,30}$/.test(message.trim()));
    byId('present-scene').hidden = Boolean(envelope);
    byId('mail-scene').hidden = !envelope;
    byId('gift-stage-label').textContent = envelope?.label || 'Un regalo';
    byId('unwrap-label').textContent = envelope?.action || 'Abrir mi regalo';
    byId('unwrap-icon').className = envelope ? 'state-icon icon-envelope' : 'state-icon icon-gift';
    byId('gift-ornament').hidden = kind !== 'gift';
    byId('carlota-surprise').hidden = kind !== 'carlota';
    byId('bow-surprise').hidden = kind !== 'bow';
    byId('secret-surprise').hidden = kind !== 'secret';
    byId('secret-note').hidden = gift.notaSecreto === false;
    byId('letter-decoration').hidden = !isLetter;
    byId('gift-signature').hidden = gift.firma === false || (gift.firma !== true && (isLetter || ['vale', 'lona', 'itinerario', 'calendario', 'video', 'cancion'].includes(kind)));
    giftTitle.classList.toggle('visually-hidden', isLetter || kind === 'vale');
    giftTitle.textContent = gift.titulo || gift.boleto?.evento || envelope?.label || 'Para ti';
    byId('gift-message').textContent = message;
    byId('gift-message').hidden = !message;
    byId('keepsake-calendar').hidden = kind !== 'calendario';
    if (kind === 'calendario') showKeepsakeMonth(gift, 0);
    fillPlans(gift.planes);
    fillMedia(gift);
    fillTicket(gift.boleto, day);

    const image = byId('gift-image');
    byId('gift-photo').hidden = !gift.imagen;
    if (gift.imagen) {
      image.src = gift.imagen;
      image.alt = gift.descripcionImagen || 'Un recuerdo especial';
    } else {
      image.removeAttribute('src');
      image.alt = '';
    }

    const link = byId('gift-link');
    const safeLink = gift.enlace && /^(https?:\/\/|\.\/|\/|#)/i.test(gift.enlace);
    link.hidden = !safeLink;
    if (safeLink) {
      link.href = gift.enlace;
      byId('gift-link-label').textContent = gift.textoEnlace || 'Descubrir mi sorpresa';
    } else {
      link.removeAttribute('href');
    }
  }

  function buildSparks() {
    const sparks = byId('opening-sparks');
    const tones = ['#52769b', '#a97855', '#fffaf0', '#8eabca'];
    const shapes = ['✦', '✧', '♡', '·'];
    for (let index = 0; index < 22; index++) {
      const spark = document.createElement('span');
      const angle = (index / 22) * 2 * Math.PI;
      const distance = 40 + (index % 3) * 12;
      spark.textContent = shapes[index % shapes.length];
      spark.style.setProperty('--x', `${Math.cos(angle) * distance}cqi`);
      spark.style.setProperty('--y', `${Math.sin(angle) * distance - 13}cqi`);
      spark.style.setProperty('--turn', `${(index % 5 - 2) * 16}deg`);
      spark.style.setProperty('--delay', `${(index % 5) * 20}ms`);
      spark.style.setProperty('--spark-color', tones[index % tones.length]);
      sparks.append(spark);
    }
  }

  function showOpeningStage() {
    lockedStage.hidden = true;
    stage.hidden = false;
    dialog.setAttribute('aria-labelledby', 'gift-stage-title');
    fillGift(selectedDay);
  }

  function updateCountdown() {
    if (!dialog.open || lockedStage.hidden) return;
    const remaining = unlockAt(selectedDay) - Date.now();
    if (remaining <= 0) {
      window.clearInterval(countdownTimer);
      const focusInside = lockedStage.contains(document.activeElement);
      showOpeningStage();
      refreshCalendar();
      dialog.scrollTop = 0;
      if (focusInside) unwrap.focus({ preventScroll: true });
      return;
    }

    const seconds = Math.ceil(remaining / 1000);
    const values = [Math.floor(seconds / 86400), Math.floor(seconds / 3600) % 24, Math.floor(seconds / 60) % 60, seconds % 60];
    countdownParts.forEach((part, index) => {
      const value = String(values[index]).padStart(2, '0');
      if (part.textContent !== value) part.textContent = value;
    });
  }

  function openGift(day) {
    window.clearTimeout(revealTimer);
    window.clearInterval(countdownTimer);
    selectedDay = day;
    stage.classList.remove('is-opening');
    reveal.hidden = true;
    unwrap.removeAttribute('aria-disabled');
    const giftDay = byId('gift-day');
    giftDay.textContent = giftDateFormat.format(new Date(anio, 11, day));
    giftDay.dateTime = `${anio}-12-${String(day).padStart(2, '0')}`;
    const isLocked = day > daysAvailable();
    if (isLocked) {
      stage.hidden = true;
      lockedStage.hidden = false;
      dialog.setAttribute('aria-labelledby', 'gift-locked-title');
    } else {
      showOpeningStage();
    }
    dialog.showModal();
    dialog.scrollTop = 0;
    if (isLocked) {
      lockedTitle.focus({ preventScroll: true });
      countdownTimer = window.setInterval(updateCountdown, 1000);
      updateCountdown();
    }
  }

  function showGiftContents() {
    if (!dialog.open) return;
    opened.add(selectedDay);
    try {
      localStorage.setItem(storageKey, JSON.stringify([...opened]));
    } catch {
      // El progreso se mantiene durante esta visita.
    }
    stage.hidden = true;
    reveal.hidden = false;
    dialog.setAttribute('aria-labelledby', 'gift-title');
    dialog.scrollTop = 0;
    giftTitle.focus({ preventScroll: true });
    refreshCalendar();
  }

  grid.addEventListener('click', event => {
    const card = event.target.closest('.day-card');
    if (!card) return;
    openGift(Number(card.dataset.day));
  });

  unwrap.addEventListener('click', () => {
    if (stage.hidden || stage.classList.contains('is-opening')) return;
    stage.classList.add('is-opening');
    unwrap.setAttribute('aria-disabled', 'true');

    if (reduceMotion.matches) {
      showGiftContents();
      return;
    }
    const duration = stage.dataset.kind === 'letter' ? LETTER_OPENING_DURATION : OPENING_DURATION;
    revealTimer = window.setTimeout(showGiftContents, duration);
  });

  ticketShare.addEventListener('click', shareTicket);
  dialog.querySelector('.close-dialog').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener('close', () => {
    if (!dialog.open) {
      window.clearTimeout(revealTimer);
      window.clearInterval(countdownTimer);
      clearPlayer();
    }
  });

  byId('calendar-year').textContent = anio;
  byId('gift-count').textContent = DAY_COUNT;
  byId('progress-bar').max = DAY_COUNT;
  buildCalendar();
  buildSparks();
  refreshCalendarClock();
  window.addEventListener('focus', refreshCalendarClock);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) refreshCalendarClock();
  });
})();
