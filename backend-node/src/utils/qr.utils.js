/**
 * QR code utilities
 */
const QRCode = require('qrcode');

async function generateQRBase64(data) {
  const dataStr = typeof data === 'string' ? data : JSON.stringify(data);
  const base64 = await QRCode.toDataURL(dataStr, {
    color: { dark: '#1e1b4b', light: '#ffffff' },
    errorCorrectionLevel: 'H',
    margin: 4,
    width: 300,
  });
  // Strip data URI prefix, return raw base64
  return base64.replace(/^data:image\/png;base64,/, '');
}

function decodeQRData(qrString) {
  if (!qrString || typeof qrString !== 'string') {
    return null;
  }

  if (qrString.includes('/ticket/')) {
    const appointmentId = extractAppointmentIdFromUrl(qrString);
    if (!appointmentId) {
      return null;
    }
    return { appointmentId, ticketUrl: qrString };
  }

  try {
    return JSON.parse(qrString);
  } catch {
    return null;
  }
}

function extractAppointmentIdFromUrl(urlString) {
  try {
    const parsed = new URL(urlString);
    const parts = parsed.pathname.split('/').filter(Boolean);
    const ticketIndex = parts.findIndex((part) => part === 'ticket');
    if (ticketIndex === -1 || !parts[ticketIndex + 1]) {
      return null;
    }
    return parts[ticketIndex + 1];
  } catch {
    return null;
  }
}

function validateAppointmentQR(qrData) {
  const required = ['appointmentId'];
  for (const field of required) {
    if (!(field in qrData)) {
      return { valid: false, error: `Missing field: ${field}` };
    }
  }
  return { valid: true, data: qrData };
}

module.exports = { generateQRBase64, decodeQRData, validateAppointmentQR, extractAppointmentIdFromUrl };
