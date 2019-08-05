import { DeviceType } from 'timeline-state-resolver'
import { TSRInput } from '../src'

export const input: TSRInput = {
	mappings: {
		'casparLayer0': {
			device: DeviceType.CASPARCG,
			deviceId: 'caspar0',
			channel: 1,
			layer: 10
		}
	}
}
