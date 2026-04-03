/**
 * Queue service — FIFO queue per doctor (ported from Python queue_service.py)
 */

// In-memory queues
const _queues = {};      // doctor_id__date -> [appointment_ids]
const _positions = {};   // appointment_id -> { doctor_id, date, position, token }
const _tokenCounters = {}; // doctor_date_key -> counter

function queueKey(doctorId, date = '') {
  const safeDate = date || new Date().toISOString().split('T')[0];
  return `${doctorId}__${safeDate}`;
}

function addToQueue(doctorId, appointmentId, token, date = '') {
  const key = queueKey(doctorId, date);
  if (!_queues[key]) _queues[key] = [];

  if (_queues[key].includes(appointmentId)) {
    return (_positions[appointmentId] || {}).position || 0;
  }

  _positions[appointmentId] = { doctor_id: doctorId, date, position: 0, token };
  _queues[key].push(appointmentId);

  _queues[key].sort((leftId, rightId) => {
    const leftToken = (_positions[leftId] || {}).token || Number.MAX_SAFE_INTEGER;
    const rightToken = (_positions[rightId] || {}).token || Number.MAX_SAFE_INTEGER;
    return leftToken - rightToken;
  });

  _queues[key].forEach((aptId, index) => {
    if (_positions[aptId]) {
      _positions[aptId].position = index + 1;
    }
  });

  return (_positions[appointmentId] || {}).position || 0;
}

function getQueueStatus(doctorId, date = '') {
  const key = queueKey(doctorId, date);
  const queue = _queues[key] || [];
  return {
    doctor_id: doctorId,
    date: date || new Date().toISOString().split('T')[0],
    total_in_queue: queue.length,
    current_token: _getCurrentServing(doctorId, date),
    queue: [...queue],
  };
}

function getPatientPosition(appointmentId) {
  return _positions[appointmentId] || null;
}

function advanceQueue(doctorId, date = '') {
  const key = queueKey(doctorId, date);
  const queue = _queues[key] || [];
  if (queue.length === 0) return null;
  const served = queue.shift();
  // Update remaining positions
  queue.forEach((aptId, i) => {
    if (_positions[aptId]) _positions[aptId].position = i + 1;
  });
  return served;
}

function _getCurrentServing(doctorId, date = '') {
  const key = queueKey(doctorId, date);
  const queue = _queues[key] || [];
  if (queue.length === 0) return 0;
  const first = queue[0];
  return (_positions[first] || {}).token || 0;
}

// Token generation
function getNextToken(doctorId, date = '') {
  if (!date) date = new Date().toISOString().split('T')[0];
  const key = `${doctorId}_${date}`;
  _tokenCounters[key] = (_tokenCounters[key] || 0) + 1;
  return _tokenCounters[key];
}

module.exports = {
  addToQueue,
  getQueueStatus,
  getPatientPosition,
  advanceQueue,
  getNextToken,
};
