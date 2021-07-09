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
		const consumer = kafka.consumer({
			groupId: "appUsageGroup",
			minBytes: 10000,
			maxWaitTimeInMs: 120000,
			sessionTimeout: 180000,
		});
		await consumer.connect();
		await consumer.subscribe({
			topic: "appUsage",
			fromBeginning: true,
		});

		const rerun = async () => {
			console.log("GETTING MESSAGES");
			await consumer.run({
				eachBatchAutoResolve: false,
				// eachMessage: async (result) => {
				// 	console.log("MESSAGE RECEIVED.");
				// 	// console.log(result);
				// 	console.log(JSON.parse(result.message.value.toString()));
				// },
				eachBatch: async ({
					batch,
					resolveOffset,
					heartbeat,
					isRunning,
					isStale,
				}) => {
					console.log(batch.messages.length);
					for (let message of batch.messages) {
						console.log(isStale());
						if (!isRunning() || isStale()) break;
						console.log({
							topic: batch.topic,
							partition: batch.partition,
							highWatermark: batch.highWatermark,
							message: {
								offset: message.offset,
								// key: message.key.toString(),
								value: message.value.toString(),
								headers: message.headers,
							},
						});
						resolveOffset(message.offset);
						await heartbeat();
					}
				},
			});
			console.log("MESSAGES GOT");
		};

		rerun();
	} catch (error) {
		console.error(error);
	}
}

run();
