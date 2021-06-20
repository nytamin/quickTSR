const osc = require("osc");

export const getSisyfosState = (ip: string, port: number): Promise<any> => {
	return new Promise((resolve: any, reject: any) => {

	const oscConnection = new osc.UDPPort({
		remoteAddress: ip,
		remotePort: port,
	});

	oscConnection
		.on("ready", () => {
			console.log("Receiving state of desk");
			oscConnection.send({address: "/state/full"});
		})
		.on("message", (message: any) => {
			if (message.address === "/state/full") {
				console.log("Received state");
				oscConnection.close();
				resolve(message.args[0])
			} else {
				console.log('Unknown OSC message')
			}
		})
		.on('error', () => {
			reject()
		})

	oscConnection.open();
})

};
