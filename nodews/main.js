// function random_str() {
// 	return (
// 		Math.random().toString(36).slice(2) +
// 		Math.random().toString(36).slice(2)
// 	);
// }

class Queue {
	constructor() {
		this.stack1 = []
		this.stack2 = []
	}

	add(item) {
		this.stack1.push(item)
	}

	pop() {
		
		if (!this.stack1.length && !this.stack2.length) {
			return
		}
		// check stack2 first 
		if (this.stack2.length) {
			return this.stack2.pop()
		}

		while (this.stack1.length) {
			this.stack2.push(this.stack1.pop())
		}

		return this.stack2.pop()
	}

	peek() {

		if (!this.stack1.length && !this.stack2.length) {
			return
		}

		if (this.stack2.length) {
			return this.stack2[this.stack2.length-1]
		}

		return this.stack1[0]
	}

	get length() {
		return this.stack1.length + this.stack2.length
	}
}

// Importing the required modules
const WebSocketServer = require("ws");
// require fs (filesystem) module
// const fs = require("fs");
const nj = require("numjs");

// const connections = {};
const encoding = "utf8";

const task_expire = 5;

async function process_msg(tasks, processed_ts) {
	return await new Promise((resolve, reject) => {

		const task = tasks.pop()

		const task_time = task[0] 
		let binary_arr = task[1] 

		for (let i = 0; i < 3000000000; i++) {
			let a = 0;
		}

		// this line might be unneccessary
		binary_arr = Buffer.from(binary_arr, "utf8");

		// console.log(
		// 	Buffer.byteLength(binary_arr, encoding),
		// 	Buffer.isEncoding(encoding),
		// 	binary_arr.length
		// );

		// todo, check a task queue. find the latest job, abondon previous jobs


		if (processed_ts.ts - task_time > task_expire) {
			
			console.log('rejected')

			reject(task_time)

			console.log('after reject?')
		}

		const arr = [];

		for (let i = 0; i < binary_arr.length; i += 4) {
			arr.push(binary_arr.readFloatLE(i));
		}

		
		if (processed_ts.ts - task_time > task_expire) {

			console.log('rejected')

			reject(task_time)

			console.log('after reject?')
		}

		const arrnj = nj.array(arr, (dtype = nj.float32));



console.log(processed_ts.ts, task_time, task_expire)
		// todo, compare different poses

		console.log('process finished at: ' + task_time);
		resolve("message processed at " + task_time);
	});
}

function start_wss() {
	// Creating a new websocket server
	const wss = new WebSocketServer.Server({ port: 8080 });

	// Creating connection using websocket
	wss.on("connection", (ws) => {
		console.log("new client connected");

		// const random_hash = random_str();

		// connections[random_hash] = ws;

		const task_queue = new Queue()
		const current_task_timestamp = {}

		// sending message
		ws.on("message", (data, isBinary) => {
			// console.log("got message");

			if (isBinary) {

				const ts = Date.now()

				task_queue.add([ts, data])
				current_task_timestamp.ts = ts

				process_msg(task_queue, current_task_timestamp);
					// .then((res) => {
					// 	ws.send("message from server: " + res);
					// })
					// .catch((err) => {
					// 	console.error("task abondoned at: " + err);
					// });

				console.log('after process_msg')
			} else {
				console.log("None binary message:", data.toString(encoding));
			}

			// console.log(arrnj, arrnj.get(-1), arrnj.get(-2), arrnj.get(-3));
			// console.log(Object.keys(data), Object.values(data));
			// console.log(Object.getOwnPropertyNames(data));
			// console.log(data.readFloatLE(), data.readFloatLE(1), data.readFloatLE(2), data.readFloatLE(3), data.readFloatLE(4), data.readFloatLE(8));
		});
		// handling what to do when clients disconnects from server
		ws.on("close", () => {
			console.log("the client has closed");

			// delete connections[random_hash];

			// console.log(connections);
		});
		// handling client connection error
		ws.onerror = function () {
			console.log("Some Error occurred");
		};
	});

	// wss.close()
	// console.log("The WebSocket server is running on port 8080");

	return wss;
}

start_wss();

// // use fs.watch() method to look for changes
// fs.watchFile("./main.js", () => {
// 	// some good stuff here! 😃
// 	try {
// 		wss.close()

// 	} catch (e) {
// 		console.log("File watcher, wss not started")
// 	}

// 	wss = start_wss();
// });
