const calculateDistance = (coordA, coordB = [-34.603722, -58.381592]) => {
  const R = 6371e3; // metres
  const φ1 = (coordA[0] * Math.PI) / 180; // φ, λ in radians
  const φ2 = (coordB[0] * Math.PI) / 180;
  const Δφ = ((coordB[0] - coordA[0]) * Math.PI) / 180;
  const Δλ = ((coordB[1] - coordA[1]) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const d = ((R * c) / 1000).toFixed(2); //In kilometres

  return `${d}kms from (${coordA}) to Buenos Aires (${coordB})`;
};

module.exports = { calculateDistance };
