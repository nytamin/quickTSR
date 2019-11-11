import {
	Conductor,
	ConductorOptions,
	Device,
	TimelineTriggerTimeResult,
	DeviceOptionsAny,
	Mappings,
	DeviceContainer,
	Timeline as TimelineTypes,
	TSRTimeline,
	TSRTimelineObjBase
} from 'timeline-state-resolver'

// import * as crypto from 'crypto'

import * as _ from 'underscore'
import { TSRSettings } from './index'
// import { CoreConnection, PeripheralDeviceAPI as P, CollectionObj } from 'tv-automation-server-core-integration'
// import { TimelineObjectCoreExt } from 'tv-automation-sofie-blueprints-integration'
// import { LoggerInstance } from './index'

export interface TSRConfig {
}
// export interface TSRSettings { // Runtime settings from Core
// 	devices: {
// 		[deviceId: string]: DeviceOptions
// 	}
// 	initializeAsClear: boolean
// 	mappings: Mappings
// 	multiThreading?: boolean
// 	multiThreadedResolver?: boolean
// }
export interface TSRDevice {
	// coreConnection: CoreConnection
	device: Device
}

// ----------------------------------------------------------------------------
// interface copied from Core lib/collections/Timeline.ts
export interface TimelineObjGeneric {
	/** Unique _id (generally obj.studioId + '_' + obj.id) */
	_id: string
	/** Unique within a timeline (ie within a studio) */
	id: string

	/** Studio installation Id */
	studioId: string
	rundownId?: string

	objectType: TimelineObjType

	enable: TimelineTypes.TimelineEnable & {
		setFromNow?: boolean
	}

	inGroup?: string

	metadata?: {
		[key: string]: any
	}

	/** Only set to true when an object is inserted by lookahead */
	isLookahead?: boolean
	/** Set when an object is on a virtual layer for lookahead, so that it can be routed correctly */
	originalLLayer?: string | number
}
export enum TimelineObjType {
	/** Objects played in a rundown */
	RUNDOWN = 'rundown',
	/** Objects controlling recording */
	RECORDING = 'record',
	/** Objects controlling manual playback */
	MANUAL = 'manual',
	/** "Magic object", used to calculate a hash of the timeline */
	STAT = 'stat'
}
// ----------------------------------------------------------------------------

export interface TimelineContentObjectTmp extends TSRTimelineObjBase {
	inGroup?: string
}
/**
 * Represents a connection between Gateway and TSR
 */
export class TSRHandler {
	tsr: Conductor

	private _multiThreaded: boolean | null = null

	// private _timeline: TSRTimeline
	// private _mappings: Mappings

	private _devices: {[deviceId: string]: DeviceContainer} = {}

	constructor () {
		// nothing
	}

	public async init (tsrSettings: TSRSettings): Promise<any> {

		// this._config = config

		console.log('TSRHandler init')

		// let settings: TSRSettings = peripheralDevice.settings || {}

		// console.log('Devices', settings.devices)
		let c: ConductorOptions = {
			getCurrentTime: Date.now,
			initializeAsClear: tsrSettings.initializeAsClear,
			multiThreadedResolver: tsrSettings.multiThreadedResolver,
			proActiveResolve: true
		}
		this.tsr = new Conductor(c)

		this.tsr.on('error', (e, ...args) => {
			console.error('TSR', e, ...args)
		})
		this.tsr.on('info', (msg, ...args) => {
			console.log('TSR', msg, ...args)
		})
		this.tsr.on('warning', (msg, ...args) => {
			console.log('Warning: TSR', msg, ...args)
		})
		// this.tsr.on('debug', (...args: any[]) => {
			// console.log(...args)
		// })

		this.tsr.on('setTimelineTriggerTime', (_r: TimelineTriggerTimeResult) => {
			// TODO

		})
		this.tsr.on('timelineCallback', (_time, _objId, _callbackName, _data) => {
			// todo ?
		})

		await this.tsr.init()

		// this._initialized = true
		// this._triggerupdateMapping()
		// this._triggerupdateTimeline()
		// this._triggerupdateDevices()
		// this.onSettingsChanged()
		// this.logger.debug('tsr init done')

	}
	destroy (): Promise<void> {
		if (this.tsr) return this.tsr.destroy()
		else return Promise.resolve()
	}
	async setTimelineAndMappings (tl: TSRTimeline, mappings: Mappings) {
		// this._timeline = tl
		// this._mappings = mappings

		await this.tsr.setMapping(mappings)
		this.tsr.timeline = tl
	}
	public setDevices (devices: {[deviceId: string]: DeviceOptionsAny}) {

		_.each(devices, (deviceOptions: DeviceOptionsAny, deviceId: string) => {

			let oldDevice: DeviceContainer = this.tsr.getDevice(deviceId)

			if (!oldDevice) {
				if (deviceOptions.options) {
					console.log('Initializing device: ' + deviceId)
					this._addDevice(deviceId, deviceOptions)
				}
			} else {
				if (this._multiThreaded !== null && deviceOptions.isMultiThreaded === undefined) {
					deviceOptions.isMultiThreaded = this._multiThreaded
				}
				if (deviceOptions.options) {
					let anyChanged = false

					// let oldOptions = (oldDevice.deviceOptions).options || {}

					if (!_.isEqual(oldDevice.deviceOptions, deviceOptions)) {
						anyChanged = true
					}

					if (anyChanged) {
						console.log('Re-initializing device: ' + deviceId)
						this._removeDevice(deviceId)
						this._addDevice(deviceId, deviceOptions)
					}
				}
			}
		})

		_.each(this.tsr.getDevices(), async (oldDevice: DeviceContainer) => {
			let deviceId = oldDevice.deviceId
			if (!devices[deviceId]) {
				console.log('Un-initializing device: ' + deviceId)
				this._removeDevice(deviceId)
			}
		})
	}
	private _addDevice (deviceId: string, options: DeviceOptionsAny): void {
		// console.log('Adding device ' + deviceId)

		// @ts-ignore
		if (!options.limitSlowSentCommand)		options.limitSlowSentCommand = 40
		// @ts-ignore
		if (!options.limitSlowFulfilledCommand)	options.limitSlowFulfilledCommand = 100

		this.tsr.addDevice(deviceId, options)
		.then(async (device: DeviceContainer) => {
			// set up device status
			await device.device.on('connectionChanged', (v) => {
				console.log('connectionchanged', v)
			})

			this._devices[deviceId] = device

			await device.device.on('connectionChanged', (status) => {
				console.log(`Device ${device.deviceId} status changed: ${status}`)
			})
			await device.device.on('slowCommand', (msg) => {
				console.log(`Device ${device.deviceId} slow command: ${msg}`)
			})
			// also ask for the status now, and update:
			// onConnectionChanged(await device.device.getStatus())

			return Promise.resolve()
		})
		.catch((e) => {
			console.error(`Error when adding device "${deviceId}"`, e)
		})
	}
	private _removeDevice (deviceId: string) {
		if (this._devices[deviceId]) {
			this._devices[deviceId].device.terminate()
			.catch(e => {
				console.error('Error when removing device: ' + e)
			})
		}
		delete this._devices[deviceId]
	}
}
