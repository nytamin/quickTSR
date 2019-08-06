import { DeviceType, TimelineContentTypeCasparCg } from 'timeline-state-resolver'
import { TSRInput } from '../src'
import { Transition } from 'timeline-state-resolver/dist/types/src/casparcg'

export const input: TSRInput = {
	timeline: [
		{
			id: 'video0',
			enable: {
				start: Date.now(),
				duration: 20 * 1000
			},
			layer: 'casparLayer0',
			content: {
				deviceType: DeviceType.CASPARCG,
				type: TimelineContentTypeCasparCg.MEDIA,
				file: 'amb',
				mixer: {
					rotation: 0,
					anchor: {
						x: 0.5,
						y: 0.5
					},
					fill: {
						x: 0.5,
						y: 0.5,
						xScale: 1,
						yScale: 1
					}
				}
			},
			keyframes: [
				{
					id: 'kf0',
					enable: {
						start: 1000,
						duration: 5000
					},
					content: {
						mixer: {
							rotation: 45,
							changeTransition: {
								type: Transition.MIX,
								duration: 5000,
								easing: 'cubic'
							}
						}
					}
				},
				{
					id: 'kf1',
					enable: {
						start: 1
					},
					content: {
						mixer: {
							changeTransition: {
								type: Transition.MIX,
								duration: 5000,
								easing: 'cubic'
							}
						}
					}
				}
			]

		}
	]
}
