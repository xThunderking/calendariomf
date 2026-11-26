const createTicketImage = (() => {
  const serif = '500 50px "Playfair Display", Georgia, serif';
  const sans = '"DM Sans", "Segoe UI", sans-serif';
  const paragraph = '500 21px ' + sans;
  const detailFont = '600 19px ' + sans;
  const labelFont = '700 15px ' + sans;
  const symbols = '"Segoe UI Symbol", "Apple Symbols", sans-serif';

  async function loadArtwork(illustration) {
    if (!illustration.getAttribute('src')) return null;

    // La ilustración se captura al abrir el regalo, aunque se seleccione otro
    // mientras el navegador termina de cargar la imagen.
    const art = new Image();
    art.crossOrigin = 'anonymous';
    art.src = illustration.src;
    try {
      await art.decode();
      return art;
    } catch {
      return null;
    }
  }

  function wrapText(ctx, text, font, width) {
    ctx.font = font;
    const lines = [];
    let line = '';
    for (const word of text.trim().split(/\s+/)) {
      const candidate = line ? line + ' ' + word : word;
      if (line && ctx.measureText(candidate).width > width) {
        lines.push(line);
        line = word;
      } else {
        line = candidate;
      }
    }
    if (line) lines.push(line);
    return lines;
  }

  function wrapTitle(ctx, text, width) {
    const lines = wrapText(ctx, text, serif, width);
    if (lines.length !== 2) return lines;

    const words = text.trim().split(/\s+/);
    let best = lines;
    let bestGap = Math.abs(ctx.measureText(lines[0]).width - ctx.measureText(lines[1]).width);
    for (let split = 1; split < words.length; split++) {
      const first = words.slice(0, split).join(' ');
      const second = words.slice(split).join(' ');
      const firstWidth = ctx.measureText(first).width;
      const secondWidth = ctx.measureText(second).width;
      const gap = Math.abs(firstWidth - secondWidth);
      if (Math.max(firstWidth, secondWidth) <= width && gap < bestGap) {
        best = [first, second];
        bestGap = gap;
      }
    }
    return best;
  }

  function paintText(ctx, text, x, y, font, color, width) {
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.fillText(text, x, y, width);
  }

  function paintLines(ctx, lines, x, y, step, font, color, width) {
    lines.forEach((line, index) => paintText(ctx, line, x, y + index * step, font, color, width));
  }

  function roundedPath(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, radius);
  }

  function circle(ctx, x, y, radius) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
  }

  function paintArtwork(ctx, art, x, y, colors) {
    const halo = ctx.createLinearGradient(x - 85, y - 85, x + 78, y + 89);
    halo.addColorStop(0, '#fffdfa');
    halo.addColorStop(1, colors.stub);
    circle(ctx, x, y, 90);
    ctx.fillStyle = halo;
    ctx.fill();
    ctx.strokeStyle = '#fffaf4';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.save();
    ctx.setLineDash([4, 5]);
    circle(ctx, x, y, 80);
    ctx.strokeStyle = colors.border;
    ctx.lineWidth = 1.4;
    ctx.stroke();
    ctx.restore();

    const scale = Math.min(181 / art.naturalWidth, 224 / art.naturalHeight);
    const width = art.naturalWidth * scale;
    const height = art.naturalHeight * scale;
    ctx.save();
    ctx.shadowColor = '#684a3234';
    ctx.shadowOffsetY = 8;
    ctx.shadowBlur = 16;
    ctx.drawImage(art, x - width / 2, y - height / 2, width, height);
    ctx.restore();

    paintText(ctx, '✦', x + 61, y - 64, '18px ' + symbols, colors.accent, 23);
    paintText(ctx, '✧', x - 74, y + 44, '21px ' + symbols, colors.accent, 23);
  }

  function paintBarcode(ctx, edge, center, accent) {
    const widths = [2, 1, 4, 2, 3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 2, 1, 3, 4, 1, 2, 3];
    ctx.fillStyle = accent;
    let x = edge;
    for (const width of widths) {
      ctx.fillRect(x, center - 16, width, 32);
      x += width + 2.5;
    }
  }

  function pngFile(canvas, filename) {
    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        if (blob) resolve(new File([blob], filename, { type: 'image/png' }));
        else reject(new Error('No se pudo crear la imagen del boleto.'));
      }, 'image/png');
    });
  }

  return async function renderTicket(copy, colors, illustration, filename) {
    const [art] = await Promise.all([
      loadArtwork(illustration),
      document.fonts.load(serif, copy.event),
      document.fonts.load(detailFont, copy.promise + copy.date + copy.time + copy.place),
      document.fonts.load(labelFont, copy.category + copy.badge)
    ]);

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const width = 800;
    const margin = 44;
    const cardWidth = width - margin * 2;
    const padding = 37;
    const left = margin + padding;
    const right = width - left;
    const contentWidth = right - left;
    const storyWidth = art ? 397 : contentWidth;
    const fields = [['Fecha', copy.date], ['Hora', copy.time], ['Lugar', copy.place]]
      .filter(([, value]) => value);
    const columnWidth = contentWidth / fields.length;
    const titleLines = wrapTitle(ctx, copy.event, storyWidth);
    const promiseLines = wrapText(ctx, copy.promise, paragraph, storyWidth);
    const titleTop = margin + 110;
    const promiseTop = titleTop + titleLines.length * 55 + 18;
    const detailsTop = Math.max(margin + (art ? 335 : 265), promiseTop + promiseLines.length * 29 + 26);
    const details = fields.map(([label, value]) => ({
      label: label.toUpperCase(),
      lines: wrapText(ctx, value, detailFont, columnWidth - 20)
    }));
    const rows = Math.max(...details.map(detail => detail.lines.length));
    const seam = detailsTop + 29 + rows * 25 + 24;
    const bottom = seam + 91;
    const height = bottom + margin;

    canvas.width = width * 2;
    canvas.height = height * 2;
    ctx.scale(2, 2);
    ctx.textBaseline = 'top';

    const background = ctx.createLinearGradient(0, height, width, 0);
    background.addColorStop(0, '#faf2e7');
    background.addColorStop(.62, '#eef3f7');
    background.addColorStop(1, '#dceaf5');
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = '#fff9';
    ctx.lineWidth = 1.4;
    roundedPath(ctx, 19, 19, width - 38, height - 38, 27);
    ctx.stroke();

    const paper = ctx.createLinearGradient(margin, seam, width - margin, margin);
    paper.addColorStop(0, colors.paper);
    paper.addColorStop(1, colors.glow);
    roundedPath(ctx, margin, margin, cardWidth, bottom - margin, 23);
    ctx.fillStyle = paper;
    ctx.save();
    ctx.shadowColor = '#34516b30';
    ctx.shadowBlur = 30;
    ctx.shadowOffsetY = 12;
    ctx.fill();
    ctx.restore();
    ctx.save();
    ctx.clip();

    // El boleto conserva el papel pastel y el talón troquelado de la vista web.
    for (const [radius, alpha] of [[124, .65], [139, .43], [156, .28]]) {
      ctx.globalAlpha = alpha;
      circle(ctx, width - 88, margin + 36, radius);
      ctx.strokeStyle = colors.border;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.fillStyle = colors.stub;
    ctx.fillRect(margin, seam, cardWidth, bottom - seam);
    ctx.restore();

    ctx.strokeStyle = colors.border;
    ctx.lineWidth = 1.5;
    roundedPath(ctx, margin, margin, cardWidth, bottom - margin, 23);
    ctx.stroke();
    ctx.beginPath();
    ctx.setLineDash([5, 6]);
    ctx.moveTo(margin + 12, seam);
    ctx.lineTo(width - margin - 12, seam);
    ctx.stroke();
    ctx.setLineDash([]);
    for (const x of [margin, width - margin]) {
      circle(ctx, x, seam, 11);
      ctx.fillStyle = x === margin ? '#f6efe7' : '#eaf1f7';
      ctx.fill();
      ctx.stroke();
    }

    const badge = copy.badge.toUpperCase();
    ctx.font = labelFont;
    let badgeWidth = 0;
    if (badge) {
      badgeWidth = Math.min(210, ctx.measureText(badge).width + 54);
      roundedPath(ctx, right - badgeWidth, margin + 26, badgeWidth, 36, 18);
      ctx.fillStyle = '#fffaf398';
      ctx.fill();
      ctx.stroke();
      paintText(ctx, '✦', right - badgeWidth + 13, margin + 34, '17px ' + symbols, colors.accent, 18);
      paintText(ctx, badge, right - badgeWidth + 34, margin + 35, labelFont, colors.accent, badgeWidth - 43);
    }
    paintText(ctx, copy.category.toUpperCase(), left, margin + 35, labelFont, colors.accent, contentWidth - badgeWidth - (badge ? 20 : 0));

    if (art) paintArtwork(ctx, art, right - 98, margin + 194, colors);
    paintLines(ctx, titleLines, left, titleTop, 55, serif, colors.ink, storyWidth);
    paintLines(ctx, promiseLines, left, promiseTop, 29, paragraph, colors.accent, storyWidth);

    details.forEach(({ label, lines }, index) => {
      const x = left + index * columnWidth;
      if (index) {
        ctx.beginPath();
        ctx.moveTo(x - 13, detailsTop);
        ctx.lineTo(x - 13, seam - 23);
        ctx.strokeStyle = colors.border;
        ctx.stroke();
      }
      paintText(ctx, label, x, detailsTop, labelFont, colors.accent, columnWidth - 20);
      paintLines(ctx, lines, x, detailsTop + 26, 25, detailFont, colors.ink, columnWidth - 20);
    });

    paintText(ctx, 'INVITACIÓN', left, seam + 21, labelFont, colors.accent, 180);
    paintText(ctx, copy.code, left, seam + 47, detailFont, colors.ink, contentWidth - 195);
    paintBarcode(ctx, right - 149, seam + 47, colors.accent);
    paintText(ctx, '♡', right - 22, seam + 29, '29px ' + symbols, colors.accent, 27);

    return pngFile(canvas, filename);
  };
})();
