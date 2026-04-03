/**
 * Assistant controller — proxies to FastAPI AI backend
 */
const { forwardToFastAPI } = require('../services/fastapi.service');

function localAssistantFallback(message = '') {
  const msg = String(message).toLowerCase();

  if (msg.includes('fever') || msg.includes('temperature')) {
    return {
      reply:
        'Fever care: stay hydrated, rest, and monitor temperature every 6-8 hours. Use paracetamol only as directed on label. Seek urgent care if fever stays high for 48 hours or breathing trouble occurs.',
      suggestions: ['Cold & cough', 'Body pain', 'Headache', 'Book appointment'],
    };
  }

  if (msg.includes('cough') || msg.includes('cold') || msg.includes('sore throat')) {
    return {
      reply:
        'For mild cold/cough: warm fluids, steam inhalation, and rest can help. If symptoms last more than a week, or you have wheeze/high fever, consult a doctor.',
      suggestions: ['Fever', 'Allergy', 'Headache', 'Book appointment'],
    };
  }

  if (msg.includes('stomach') || msg.includes('acidity') || msg.includes('vomit') || msg.includes('diarrhea')) {
    return {
      reply:
        'For stomach discomfort: take light meals, avoid spicy/oily food, and drink ORS/water in small sips. Seek care quickly if pain is severe, persistent, or there is blood in stool/vomit.',
      suggestions: ['Nausea', 'Bloating', 'Food poisoning', 'Book appointment'],
    };
  }

  return {
    reply:
      'I can help with common symptoms. Please share what you feel, since when, and how severe it is. I can then suggest next steps and the right specialist.',
    suggestions: ['Fever', 'Cold & cough', 'Headache', 'Stomach pain'],
  };
}

async function chat(req, res) {
  try {
    const { message } = req.body;
    const response = await forwardToFastAPI('/api/v1/assistant/chat', { message });
    res.json(response);
  } catch (err) {
    const fallback = localAssistantFallback(req.body?.message);
    res.json({ ...fallback, source: 'node-fallback' });
  }
}

module.exports = { chat };
