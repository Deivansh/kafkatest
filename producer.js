const { Kafka } = require("kafkajs");

async function run() {
	try {
		const kafka = new Kafka({
			clientId: "mykafka",
			brokers: ["192.168.0.101:9092"],
		});
		let obj = {
			name: "Devansh",
			surname: "Sharma",
			hobbies: ["basketball", "cricket"],
		};
		const producer = kafka.producer();
		await producer.connect();

		setInterval(async () => {
			let obj_new = { ...obj };
			obj_new.name = obj_new.name + `${123}`;
			const result = await producer.send({
				topic: "appUsage",
				messages: [{ value: JSON.stringify(obj_new), partition: 0 }],
			});
			console.log(result);
		}, 30000);

		// for (let i = 0; i < 473; i++) {}

		// console.log("Done!");
		// await producer.disconnect();
	} catch (error) {
		console.error(error);
	}
}

run();
