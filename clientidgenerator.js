function generateClientId() {
  return `mqtt_${Math.random().toString(16).slice(3)}`;
}
module.exports = generateClientId;
