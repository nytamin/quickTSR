import * as chokidar from 'chokidar'

import * as fs from 'fs'
import * as _ from 'underscore'
import { DeviceOptions, Mappings, TSRTimeline } from 'timeline-state-resolver'
import { TSRHandler } from './tsrHandler'
const clone = require('fast-clone')
// import { TSRHandler } from './tsrHandler'

console.log('Starting Quick-TSR')

// const tsr = new TSRHandler(console.log)

const watcher = chokidar.watch('input/**', { ignored: /^\./, persistent: true })

watcher
.on('add', () => {
	reloadInput()
})
.on('change', () => {
	reloadInput()
})
.on('unlink', () => {
	reloadInput()
})
.on('error', error => {
	console.error('Error', error)
})

const currentInput: Input = {
	devices: {},
	mappings: {},
	settings: {},
	timeline: []
}
let tsr = new TSRHandler()
function reloadInput () {

	const newInput: Input = {
		devices: {},
		mappings: {},
		settings: {},
		timeline: []
	}
	_.each(fs.readdirSync('input/'), file => {

		if (file[0] === '_') {
			// ignore files that begin with "_"
			return
		}
		const path = '../input/' + file
		if (path.match(/\.ts$/)) {

			delete require.cache[require.resolve(path)]

			const fileContents = require(path)

			const fileInput = fileContents.input || {}

			// console.log(path, fileInput)

			_.each(fileInput.devices, (device: any, deviceId) => {
				newInput.devices[deviceId] = device
			})
			_.each(fileInput.mappings, (mapping: any, mappingId) => {
				newInput.mappings[mappingId] = mapping
			})
			_.each(fileInput.settings, (setting: any, settingId) => {
				newInput.settings[settingId] = setting
			})

			_.each(fileInput.timeline, (obj: any) => {
				newInput.timeline.push(obj)
			})
		}
	})
	// react to changes:
	Promise.resolve()
	.then(async () => {

		if (!_.isEqual(newInput.settings, currentInput.settings)) {

			console.log('************************ Settings changed ******************')
			currentInput.settings = clone(newInput.settings)
			currentInput.devices = {}
			currentInput.mappings = {}
			currentInput.timeline = []

			await tsr.destroy()

			tsr = new TSRHandler()
			await tsr.init(newInput.settings)
		}

		if (!_.isEqual(newInput.devices, currentInput.devices)) {
			console.log('************************ Devices changed ******************')
			currentInput.devices = clone(newInput.devices)
			currentInput.mappings = {}
			currentInput.timeline = []

			tsr.setDevices(newInput.devices)
		}

		if (
			!_.isEqual(newInput.mappings, currentInput.mappings) ||
			!_.isEqual(newInput.timeline, currentInput.timeline)
		) {
			console.log('************************ Timeline / Mappings changed ******************')
			currentInput.mappings = clone(newInput.mappings)
			currentInput.timeline = clone(newInput.timeline)

			tsr.setTimelineAndMappings(newInput.timeline, newInput.mappings)
		}
	})
	.catch(console.error)
}
export type Optional<T> = {
	[K in keyof T]?: T[K]
}
export type TSRInput = Optional<Input>

export interface Input {
	settings: TSRSettings,
	devices: {
		[deviceId: string]: DeviceOptions
	},
	mappings: Mappings,
	timeline: TSRTimeline
}
export interface TSRSettings {
	initializeAsClear?: boolean
	multiThreading?: boolean
	multiThreadedResolver?: boolean
}

// ------------
reloadInput()
console.log('Listening to changes in /input...')
