const mqtt = require('mqtt');
const TEAM_ID = "quantum_bitflip_0xDEAD";
const MQTT_BROKER = "mqtt://broker.benax.rw:1883";
const TOPIC_FILTER = `rfid/${TEAM_ID}/#`;

console.log(`[DEBUG] Connecting to ${MQTT_BROKER}...`);
const client = mqtt.connect(MQTT_BROKER);

client.on('connect', () => {
    console.log(`[DEBUG] Connected! Subscribing to ${TOPIC_FILTER}`);
    client.subscribe(TOPIC_FILTER);
});

client.on('message', (topic, message) => {
    console.log(`[MQTT] Topic: ${topic} | Message: ${message.toString()}`);
});

client.on('error', (err) => {
    console.error(`[MQTT ERROR] ${err}`);
});

// Run for 45 seconds to give time for a card scan
setTimeout(() => {
    console.log("[DEBUG] Monitoring period finished.");
    client.end();
    process.exit(0);
}, 45000);
