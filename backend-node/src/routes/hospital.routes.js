/**
 * Hospital routes
 */
const express = require('express');
const router = express.Router();
const { haversineDistance, estimateTravelTime } = require('../services/map.service');
const { HOSPITALS, getDoctorsByHospital, getDoctorsByHospitalName } = require('../data/hospital.data');

router.get('/', (req, res) => {
  res.json(HOSPITALS);
});

router.get('/nearby', (req, res) => {
  const lat = parseFloat(req.query.lat) || 28.6139;
  const lng = parseFloat(req.query.lng) || 77.2090;
  const results = HOSPITALS.map((h) => {
    const dist = haversineDistance(lat, lng, h.lat, h.lng);
    const eta = estimateTravelTime(dist);
    return { ...h, distance: `${dist} km`, eta: `${eta} min` };
  });
  results.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
  res.json(results);
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
