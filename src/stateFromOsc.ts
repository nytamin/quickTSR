const osc = require("osc");

export const getSisyfosState = (ip: string, port: number) => {
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
				console.log("Received state", message);
				oscConnection.close();
			} else {
				console.log('Unknown message :', message)
			}
		});

	oscConnection.open();
};
