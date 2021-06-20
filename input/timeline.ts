import { DeviceType, TimelineContentTypeSisyfos } from 'timeline-state-resolver'
import { TSRInput } from '../src/index'

export const input: TSRInput = {
	timeline: [
		{
			id: 'baseline1',
			enable: {
				while: '1'
			},
			layer: 'sisyfos0Fader1',
			content: {
				deviceType: DeviceType.SISYFOS,
				type: TimelineContentTypeSisyfos.SISYFOS,
				isPgm: false,
				isPst: false
			},
			priority: 0,
			isLookahead: true
		},
		{
			id: 'f1pgm',
			enable: {
				start: Date.now() + 1000,
				duration: 1000,
				repeating: 3000
			},
			layer: 'sisyfos0Fader1',
			content: {
				deviceType: DeviceType.SISYFOS,
				type: TimelineContentTypeSisyfos.SISYFOS,
				isPgm: true
			},
			priority: 1,
			isLookahead: false

		},
		{
			id: 'f1pst',
			enable: {
				start: Date.now() + 3000,
				duration: 1000,
				repeating: 3000
			},
			layer: 'sisyfos0Fader1',
			content: {
				deviceType: DeviceType.SISYFOS,
				type: TimelineContentTypeSisyfos.SISYFOS,
				isPst: true
			},
			priority: 1,
			isLookahead: true

		},
		{
			id: 'baseline2',
			enable: {
				while: '1'
			},
			layer: 'sisyfos0Fader2',
			content: {
				deviceType: DeviceType.SISYFOS,
				type: TimelineContentTypeSisyfos.SISYFOS,
				isPgm: false
			},
			priority: 0,
			isLookahead: true
		},
		{
			id: 'f2pgm',
			enable: {
				start: Date.now() + 2000,
				duration: 1000,
				repeating: 3000
			},
			layer: 'sisyfos0Fader2',
			content: {
				deviceType: DeviceType.SISYFOS,
				type: TimelineContentTypeSisyfos.SISYFOS,
				isPgm: true
			},
			priority: 1,
			isLookahead: false

		},
		{
			id: 'f2pst',
			enable: {
				start: Date.now() + 4000,
				duration: 1000,
				repeating: 3000
			},
			layer: 'sisyfos0Fader2',
			content: {
				deviceType: DeviceType.SISYFOS,
				type: TimelineContentTypeSisyfos.SISYFOS,
				isPst: true
			},
			priority: 1,
			isLookahead: true

		},
		{
			id: 'baseline3',
			enable: {
				while: '1'
			},
			layer: 'sisyfos0Fader3',
			content: {
				deviceType: DeviceType.SISYFOS,
				type: TimelineContentTypeSisyfos.SISYFOS,
				isPgm: false
			},
			priority: 0,
			isLookahead: true
		},
		{
			id: 'f3pgm',
			enable: {
				start: Date.now() + 3000,
				duration: 1000,
				repeating: 3000
			},
			layer: 'sisyfos0Fader3',
			content: {
				deviceType: DeviceType.SISYFOS,
				type: TimelineContentTypeSisyfos.SISYFOS,
				isPgm: true
			},
			priority: 1,
			isLookahead: false

		},
		{
			id: 'f3pst',
			enable: {
				start: Date.now() + 5000,
				duration: 1000,
				repeating: 3000
			},
			layer: 'sisyfos0Fader3',
			content: {
				deviceType: DeviceType.SISYFOS,
				type: TimelineContentTypeSisyfos.SISYFOS,
				isPst: true
			},
			priority: 1,
			isLookahead: true

		},
	]
}
