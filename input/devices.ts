import { TSRInput } from '..'
import { DeviceType } from 'timeline-state-resolver'

export const input: TSRInput = {
	devices: {
		'sisyfos0': {
			type: DeviceType.SISYFOS,
			options: {
				host: '127.0.0.1',
				port: 5255

			}
		}
	}
}
