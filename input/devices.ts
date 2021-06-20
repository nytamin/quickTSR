import { TSRInput } from "../src/index";
import { DeviceType } from "timeline-state-resolver";
import { SISYFOS0_ADDRESS } from "../src/CONSTANTS";

export const input: TSRInput = {
	devices: {
		sisyfos0: {
			type: DeviceType.SISYFOS,
			options: {
				host: SISYFOS0_ADDRESS,
				port: 5255,
			},
		},
	},
};
