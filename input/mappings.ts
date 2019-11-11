import { DeviceType, MappingCasparCG } from 'timeline-state-resolver'
import { TSRInput } from '../src'
import { literal } from 'timeline-state-resolver/dist/devices/device'

export const input: TSRInput = {
	mappings: {
		'casparLayer0': literal<MappingCasparCG>({
			device: DeviceType.CASPARCG,
			deviceId: 'caspar0',
			channel: 1,
			layer: 10
		})
	}
}
