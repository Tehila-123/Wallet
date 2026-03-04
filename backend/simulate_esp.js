const mqtt = require('mqtt');
const TEAM_ID = "quantum_bitflip_0xDEAD";
const MQTT_BROKER = "mqtt://broker.benax.rw:1883";
const TOPIC_STATUS = `rfid/${TEAM_ID}/card/status`;

console.log(`[SIMULATOR] Connecting to ${MQTT_BROKER}...`);
const client = mqtt.connect(MQTT_BROKER);

client.on('connect', () => {
    const payload = JSON.stringify({
        uid: "SIM_A1B2C3D4",
        balance: 100,
        status: "detected",
        ts: Math.floor(Date.now() / 1000)
    });
    console.log(`[SIMULATOR] Connected! Publishing to ${TOPIC_STATUS}`);
    client.publish(TOPIC_STATUS, payload, () => {
        console.log("[SIMULATOR] Message published. Waiting 2s before exiting.");
        setTimeout(() => {
            client.end();
            process.exit(0);
        }, 2000);
    });
});

client.on('error', (err) => {
    console.error(`[SIMULATOR ERROR] ${err}`);
    process.exit(1);
});
