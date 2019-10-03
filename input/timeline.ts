import { DeviceType, TimelineContentTypeSisyfos } from 'timeline-state-resolver'
import { TSRInput } from '..'

export const input: TSRInput = {
	timeline: [
		{
			id: 'baseline',
			enable: {
				while: '1'
			},
			layer: 'fader1',
			content: {
				deviceType: DeviceType.SISYFOS,
				type: TimelineContentTypeSisyfos.SISYFOS,
				isPst: 0
			},
			priority: 0

		},
		{
			id: 'pgm',
			enable: {
				start: Date.now() + 2000,
				duration: 3000
				// repeating: 2000
			},
			layer: 'fader1',
			content: {
				deviceType: DeviceType.SISYFOS,
				type: TimelineContentTypeSisyfos.SISYFOS,
				isPst: 1
			},
			priority: 1

		},
		{
			id: 'pgm1',
			enable: {
				start: Date.now() + 6000,
				duration: 3000
			},
			layer: 'fader1',
			content: {
				deviceType: DeviceType.SISYFOS,
				type: TimelineContentTypeSisyfos.SISYFOS,
				isPst: 0
			},
			priority: 1

		},
		{
			id: 'pgm2',
			enable: {
				start: Date.now() + 9000,
				duration: 3000
			},
			layer: 'fader1',
			content: {
				deviceType: DeviceType.SISYFOS,
				type: TimelineContentTypeSisyfos.SISYFOS,
				isPst: 2
			},
			priority: 1

		}
	]
}
