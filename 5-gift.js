const giftIban = document.getElementById('gift-iban');
const copyIban = document.getElementById('copy-iban');
const copyStatus = document.getElementById('gift-copy-status');

if (giftIban && copyIban && copyStatus) {
  const iban = giftIban.textContent.replace(/\s/g, '');
  if (/^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/.test(iban)) {
    copyIban.hidden = false;
    copyIban.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(iban);
        copyStatus.textContent = 'IBAN copiado. ¡Gracias!';
      } catch {
        copyStatus.textContent = 'Mantén pulsado el número para copiarlo.';
      }
    });
  }
}

