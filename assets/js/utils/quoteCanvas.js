/**
 * Geetha GPT - Canvas Quote Card Image Generator
 * Generates beautiful downloadable social quote cards (1080x1080px or 1200x630px)
 */

export function generateQuoteCardImage(verse, lang = 'en', theme = 'light') {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 900;
  const ctx = canvas.getContext('2d');

  const isDark = theme === 'dark';
  
  // Background Gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 1200, 900);
  if (isDark) {
    bgGrad.addColorStop(0, '#1A1816');
    bgGrad.addColorStop(1, '#121110');
  } else {
    bgGrad.addColorStop(0, '#FFFDF9');
    bgGrad.addColorStop(1, '#F7EFE4');
  }
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1200, 900);

  // Outer Border & Gold Accents
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#D97706';
  ctx.strokeRect(30, 30, 1140, 840);

  ctx.lineWidth = 1.5;
  ctx.strokeStyle = isDark ? '#78350F' : '#FDE68A';
  ctx.strokeRect(45, 45, 1110, 810);

  // Header Title
  ctx.fillStyle = '#D97706';
  ctx.font = 'bold 28px "Cinzel", Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('GEETHA GPT • BHAGAVAD GITA WISDOM', 600, 110);

  // Chapter & Verse Ref
  ctx.fillStyle = isDark ? '#F59E0B' : '#B45309';
  ctx.font = '600 24px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`Chapter ${verse.chapter}, Verse ${verse.verse}`, 600, 160);

  // Decorative Divider
  ctx.fillStyle = '#D97706';
  ctx.fillText('❖  ✦  ❖', 600, 205);

  // Sanskrit Shloka
  ctx.fillStyle = isDark ? '#FFFFFF' : '#1C1917';
  ctx.font = 'bold 30px "Noto Serif Devanagari", serif';
  const sanskritLines = verse.sanskrit.split('\n');
  let currentY = 275;
  sanskritLines.forEach(line => {
    ctx.fillText(line, 600, currentY);
    currentY += 45;
  });

  // Translation Header
  currentY += 30;
  ctx.fillStyle = '#D97706';
  ctx.font = 'italic 20px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(lang === 'te' ? '— తాత్పర్యం —' : '— Translation —', 600, currentY);

  // Translation Text (Word wrap)
  currentY += 45;
  const translationText = lang === 'te' ? (verse.teluguTranslation || verse.englishTranslation) : verse.englishTranslation;
  ctx.fillStyle = isDark ? '#E5E0D8' : '#292524';
  ctx.font = lang === 'te' ? '24px "Noto Sans Telugu", sans-serif' : '22px "Plus Jakarta Sans", Georgia, serif';
  
  const words = translationText.split(' ');
  let line = '';
  const maxWidth = 980;
  const lineHeight = 38;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line.trim(), 600, currentY);
      line = words[n] + ' ';
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), 600, currentY);

  // Footer Watermark
  ctx.fillStyle = isDark ? '#7C756D' : '#8E887F';
  ctx.font = '16px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Discover timeless guidance at Geetha GPT', 600, 825);

  return canvas.toDataURL('image/png');
}

