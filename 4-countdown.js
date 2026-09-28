/* La ceremonia es a las 17:30 en La Adrada (UTC+02:00 ese día). */
const CEREMONY_AT = Date.parse('2026-10-17T17:30:00+02:00');
const CELEBRATION_ENDS_AT = Date.parse('2026-10-18T04:00:00+02:00');

function getCountdownState(now = Date.now()) {
  if (!Number.isFinite(now)) return { phase: 'unavailable' };
  if (now >= CELEBRATION_ENDS_AT) return { phase: 'finished' };
  if (now >= CEREMONY_AT) return { phase: 'celebrating' };
  const seconds = Math.ceil((CEREMONY_AT - now) / 1000);
  return {
    phase: 'counting',
    days: Math.floor(seconds / 86400),
    hours: Math.floor((seconds % 86400) / 3600),
    minutes: Math.floor((seconds % 3600) / 60),
    seconds: seconds % 60,
  };
}

if (typeof document !== 'undefined') {
  const units = document.getElementById('countdown-units');
  const fallback = document.getElementById('countdown-fallback');
  const caption = document.getElementById('countdown-caption');
  const message = document.getElementById('countdown-message');
  const fields = ['days', 'hours', 'minutes', 'seconds'];
  const numbers = Object.fromEntries(fields.map(field => [field, document.getElementById('count-' + field)]));
  let clock;

  function renderCountdown() {
    const state = getCountdownState();
    if (state.phase === 'unavailable') {
      fallback.hidden = false;
      units.hidden = caption.hidden = message.hidden = true;
      return;
    }
    fallback.hidden = true;
    const counting = state.phase === 'counting';
    units.hidden = caption.hidden = !counting;
    message.hidden = counting;
    if (counting) {
      for (const field of fields) {
        const value = String(state[field]).padStart(2, '0');
        if (numbers[field].textContent !== value) numbers[field].textContent = value;
      }
    } else {
      const text = state.phase === 'celebrating'
        ? '¡Llegó el gran día! Nos vemos en la pista.'
        : '¡Gracias por celebrar con nosotros!';
      if (message.textContent !== text) message.textContent = text;
      if (state.phase === 'finished' && clock) clearInterval(clock);
    }
  }

  if (units && fallback && caption && message && fields.every(field => numbers[field])) {
    renderCountdown();
    clock = setInterval(() => {
      if (!document.hidden) renderCountdown();
    }, 1000);
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) renderCountdown();
    });
    window.addEventListener('pageshow', renderCountdown);
  }
}

