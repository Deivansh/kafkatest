const { Kafka } = require("kafkajs");

async function run() {
	try {
		const kafka = new Kafka({
			clientId: "mykafka",
			brokers: ["192.168.0.101:9092"],
		});
		const admin = kafka.admin();
		await admin.connect();
		// const result = await admin.createTopics({
		// 	topics: [
		// 		{
		// 			topic: "appUsage",
		// 			numPartitions: 2,
		// 		},
		// 	],
		// });
		const result = await admin.deleteTopicRecords({
			topic: "appUsage",
			partitions: [
				{
					partition: 1,
					offset: "100",
				},
			],
		});
		console.log(result);
		console.log("Done!");
		await admin.disconnect();
	} catch (error) {
		console.error(error);
	} finally {
		await admin.disconnect();
	}
}

run();
