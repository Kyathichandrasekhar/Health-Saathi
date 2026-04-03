/**
 * Assistant controller — proxies to FastAPI AI backend
 */
const { forwardToFastAPI } = require('../services/fastapi.service');

function ensurePointWiseReply(rawReply = '', fallbackTitle = 'Health Guidance') {
  const text = String(rawReply || '').trim();
  if (!text) {
    return [
      `**${fallbackTitle}:**`,
      '1. Please share symptom, duration, severity, and age.',
      '2. I will provide point-wise triage guidance.',
    ].join('\n');
  }

  if (/^\s*\d+\./m.test(text) || text.includes('**Basic') || text.includes('**Emergency')) {
    return text;
  }

  const sentences = text
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?])\s+/)
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 6);

  if (!sentences.length) {
    return text;
  }

  return [
    `**${fallbackTitle} (point-wise):**`,
    ...sentences.map((sentence, index) => `${index + 1}. ${sentence}`),
  ].join('\n');
}

function localAssistantFallback(message = '') {
  const msg = String(message).toLowerCase();

  const isAny = (keywords) => keywords.some((keyword) => msg.includes(keyword));

  const formatPointReply = ({
    assessment,
    likely,
    steps,
    urgent,
    specialist,
    safety,
  }) => {
    const stepsText = steps.map((item) => `- ${item}`).join('\n');
    const urgentText = urgent.map((item) => `- ${item}`).join('\n');

    return [
      '**Basic Triage (point-wise):**',
      `1. **Assessment:** ${assessment}`,
      `2. **Likely causes:** ${likely}`,
      '3. **What to do now:**',
      stepsText,
      `4. **Recommended specialist:** ${specialist}`,
      '5. **Go to hospital urgently if:**',
      urgentText,
      `6. **Safety note:** ${safety}`,
    ].join('\n');
  };

  const emergencyKeywords = [
    'chest pain',
    'cannot breathe',
    'difficulty breathing',
    'shortness of breath',
    'seizure',
    'fainted',
    'unconscious',
    'heavy bleeding',
    'blood vomiting',
  ];

  if (emergencyKeywords.some((keyword) => msg.includes(keyword))) {
    return {
      reply: [
        '**Emergency Alert:**',
        '1. This may be an urgent condition.',
        '2. Go to nearest emergency hospital now or call local emergency services.',
        '3. Do not delay treatment based only on chat advice.',
      ].join('\n'),
      suggestions: ['Call emergency', 'Nearest hospital', 'Book appointment', 'Share more symptoms'],
    };
  }

  if (msg.includes('book') || msg.includes('appointment') || msg.includes('doctor')) {
    return {
      reply: [
        '**Booking Guidance:**',
        '1. Share symptom + duration + severity + age first.',
        '2. I will suggest the right specialist.',
        '3. Then proceed to Book page for appointment.',
      ].join('\n'),
      suggestions: ['General Physician', 'ENT', 'Dermatologist', 'Orthopedic', 'Book appointment'],
    };
  }

  if (isAny(['fever', 'temperature', 'chills', 'shivering'])) {
    return {
      reply: formatPointReply({
        assessment: 'Fever pattern, likely mild viral infection.',
        likely: 'Viral fever, flu-like illness, seasonal infection.',
        steps: [
          'Drink water/ORS frequently.',
          'Take proper rest and light diet.',
          'Monitor temperature every 6 to 8 hours.',
          'Use paracetamol only as per label/doctor advice.',
        ],
        urgent: [
          'Fever above 102 F for more than 48 hours.',
          'Breathing difficulty.',
          'Persistent vomiting or confusion.',
        ],
        specialist: 'General Physician',
        safety: 'Avoid starting antibiotics without prescription.',
      }),
      suggestions: ['Cold & cough', 'Body pain', 'Headache', 'General Physician'],
    };
  }

  if (isAny(['cough', 'cold', 'sore throat', 'runny nose', 'congestion'])) {
    return {
      reply: formatPointReply({
        assessment: 'Upper respiratory infection/allergy pattern.',
        likely: 'Viral cold, throat irritation, allergic rhinitis.',
        steps: [
          'Warm fluids and steam inhalation 2-3 times/day.',
          'Salt-water gargle for throat pain.',
          'Rest and avoid dust/smoke exposure.',
        ],
        urgent: [
          'Wheezing or breathlessness.',
          'High fever with cough.',
          'Symptoms worsening after 5 to 7 days.',
        ],
        specialist: 'General Physician / ENT',
        safety: 'Avoid cough syrups with sedation before driving/work.',
      }),
      suggestions: ['Fever', 'Allergy', 'ENT', 'Book appointment'],
    };
  }

  if (isAny(['stomach', 'acidity', 'vomit', 'vomiting', 'diarrhea', 'loose motion', 'gas', 'bloating'])) {
    return {
      reply: formatPointReply({
        assessment: 'Gastric irritation or mild stomach infection pattern.',
        likely: 'Acidity/gastritis, food intolerance, stomach infection.',
        steps: [
          'Take bland food (rice/banana/toast/curd).',
          'Drink ORS/water in small frequent sips.',
          'Avoid spicy/oily food for 24 to 48 hours.',
        ],
        urgent: [
          'Blood in stool/vomit.',
          'Severe dehydration or dizziness.',
          'Persistent severe abdominal pain.',
        ],
        specialist: 'General Physician / Gastroenterologist',
        safety: 'Avoid random painkillers on empty stomach.',
      }),
      suggestions: ['Nausea', 'Bloating', 'Food poisoning', 'Gastroenterologist'],
    };
  }

  if (isAny(['headache', 'migraine', 'head pain', 'head hurts'])) {
    return {
      reply: formatPointReply({
        assessment: 'Headache pattern, often due to stress/dehydration/eye strain.',
        likely: 'Tension headache, migraine tendency, eye strain.',
        steps: [
          'Hydrate and rest in a dim quiet room.',
          'Reduce screen exposure for a few hours.',
          'Take simple pain-relief tablet only if safe for you.',
        ],
        urgent: [
          'Sudden worst headache of life.',
          'Repeated vomiting or confusion.',
          'Weakness, slurred speech, or vision change.',
        ],
        specialist: 'General Physician / Neurologist',
        safety: 'Do not overuse painkillers daily.',
      }),
      suggestions: ['Eye strain', 'Stress', 'Fever', 'Neurologist'],
    };
  }

  if (isAny(['body pain', 'muscle pain', 'joint pain', 'back pain', 'neck pain', 'fatigue', 'weakness'])) {
    return {
      reply: formatPointReply({
        assessment: 'Musculoskeletal/body pain pattern.',
        likely: 'Viral body ache, muscle strain, posture-related pain, fatigue.',
        steps: [
          'Take rest and avoid heavy activity for 24 to 48 hours.',
          'Use hot compress for stiff muscles or cold compress for fresh strain.',
          'Hydrate, sleep well, and start gentle stretching after pain reduces.',
        ],
        urgent: [
          'High fever with severe body pain.',
          'Weakness/numbness in limbs.',
          'Pain after injury or not improving for 1 week.',
        ],
        specialist: 'General Physician / Orthopedic',
        safety: 'Avoid high-dose painkillers without medical advice.',
      }),
      suggestions: ['Fever', 'Back pain', 'Joint pain', 'Orthopedic'],
    };
  }

  if (isAny(['rash', 'itching', 'allergy', 'skin'])) {
    return {
      reply: formatPointReply({
        assessment: 'Skin allergy/irritation pattern.',
        likely: 'Allergic rash, irritant dermatitis, dry skin reaction.',
        steps: [
          'Avoid trigger products/foods if known.',
          'Use mild moisturizer/calamine and keep area cool.',
          'Do not scratch the skin lesions.',
        ],
        urgent: [
          'Lip/tongue swelling.',
          'Breathing difficulty.',
          'Rapidly spreading rash with fever.',
        ],
        specialist: 'Dermatologist / Allergist',
        safety: 'Avoid steroid creams without prescription.',
      }),
      suggestions: ['Itching', 'Skin rash', 'Allergy', 'Dermatologist'],
    };
  }

  return {
    reply: [
      '**Please share details in points so I can triage better:**',
      '1. Main symptom (example: fever, cough, body pain).',
      '2. Duration (how many days).',
      '3. Severity (mild/moderate/severe).',
      '4. Age and any chronic condition (BP/sugar/asthma).',
    ].join('\n'),
    suggestions: ['Fever', 'Cold & cough', 'Headache', 'Stomach pain', 'Skin rash'],
  };
}

async function chat(req, res) {
  try {
    const { message } = req.body;
    const response = await forwardToFastAPI('/api/v1/assistant/chat', { message });

    const pointWiseReply = ensurePointWiseReply(response?.reply, 'RMP-style Triage');
    const safeSuggestions = Array.isArray(response?.suggestions) && response.suggestions.length
      ? response.suggestions
      : ['Fever', 'Cold & cough', 'Headache', 'Stomach pain', 'Body pain'];

    res.json({
      ...response,
      reply: pointWiseReply,
      suggestions: safeSuggestions,
    });
  } catch (err) {
    const fallback = localAssistantFallback(req.body?.message);
    res.json({ ...fallback, source: 'node-fallback' });
  }
}

module.exports = { chat };
