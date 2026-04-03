/**
 * Map service — distance and time calculations
 * Ported from Python map_service.py
 */

function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.asin(Math.sqrt(a));
  return Math.round(R * c * 10) / 10;
}

function estimateTravelTime(distanceKm, speedKmh = 30) {
  return Math.max(1, Math.round((distanceKm / speedKmh) * 60));
}

function toRad(deg) {
  return (deg * Math.PI) / 180;
}

module.exports = { haversineDistance, estimateTravelTime };
