/**
 * Hospital routes
 */
const express = require('express');
const router = express.Router();
const { haversineDistance, estimateTravelTime } = require('../services/map.service');
const { HOSPITALS, getDoctorsByHospital, getDoctorsByHospitalName } = require('../data/hospital.data');

function toCompactHospital(hospital) {
  return {
    id: hospital.id,
    name: hospital.name,
    address: hospital.address,
    lat: hospital.lat,
    lng: hospital.lng,
    rating: hospital.rating,
  };
}

router.get('/', (req, res) => {
  const limitQuery = Number.parseInt(req.query.limit, 10);
  const limit = Number.isFinite(limitQuery) && limitQuery > 0
    ? Math.min(limitQuery, HOSPITALS.length)
    : HOSPITALS.length;
  const compact = String(req.query.compact || '0') === '1';

  res.set('Cache-Control', 'public, max-age=120, stale-while-revalidate=600');

  const hospitals = HOSPITALS.slice(0, limit);
  res.json(compact ? hospitals.map(toCompactHospital) : hospitals);
});

router.get('/nearby', (req, res) => {
  const lat = parseFloat(req.query.lat) || 28.6139;
  const lng = parseFloat(req.query.lng) || 77.2090;
  const limitQuery = Number.parseInt(req.query.limit, 10);
  const limit = Number.isFinite(limitQuery) && limitQuery > 0
    ? Math.min(limitQuery, HOSPITALS.length)
    : HOSPITALS.length;
  const compact = String(req.query.compact || '0') === '1';

  const results = HOSPITALS.map((h) => {
    const dist = haversineDistance(lat, lng, h.lat, h.lng);
    const eta = estimateTravelTime(dist);
    return { ...h, distance: `${dist} km`, eta: `${eta} min` };
  });
  results.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

  const sliced = results.slice(0, limit);
  res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
  res.json(compact ? sliced.map(toCompactHospital) : sliced);
});

router.get('/doctors/by-name', (req, res) => {
  const hospitalName = String(req.query.hospitalName || '').trim();
  if (!hospitalName) {
    return res.status(400).json({ error: 'hospitalName query is required' });
  }

  res.json(getDoctorsByHospitalName(hospitalName));
});

router.get('/:hospital_id', (req, res) => {
  const h = HOSPITALS.find((h) => h.id === req.params.hospital_id);
  if (h) return res.json(h);
  res.json({ error: 'Hospital not found' });
});

router.get('/:hospital_id/doctors', (req, res) => {
  res.json(getDoctorsByHospital(req.params.hospital_id));
});

module.exports = router;
