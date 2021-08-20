import { spawn } from 'child_process'
import { Observable } from 'rxjs'

import { toMs } from './helpers/to-ms'
import type { AudioFormat, SubTitleFormat, VideoFormat } from './types'

const DURATION_REG_EXP = /Duration: (\d{2}):(\d{2}):(\d{2})\.(\d{2})/
const TIME_REG_EXP = /time=(\d{2}):(\d{2}):(\d{2})\.(\d{2})/

export interface TranscodeOptions {
	readonly audioFormat?: AudioFormat
	readonly inputPath: string
	readonly outputFormat?: 'matroska'
	readonly outputPath: string
	readonly subTitleFormat?: SubTitleFormat
	readonly videoFormat?: VideoFormat
}

export interface TranscodeEvent {
	readonly current: number
	readonly progress: number
	readonly total: number
}

export function transcode({
	audioFormat = 'aac',
	inputPath,
	outputFormat = 'matroska',
	outputPath,
	subTitleFormat = 'srt',
	videoFormat = 'libx265',
}: TranscodeOptions): Observable<TranscodeEvent> {
	return new Observable((subscriber) => {
		// prettier-ignore
		const ffmpegArgs = [
			'-i', inputPath,
			'-hide_banner',
			'-map_chapters', '-1',
			'-map_metadata', '-1',
			'-c:a', audioFormat,
			'-c:s', subTitleFormat,
			'-c:v', videoFormat,
			'-f', outputFormat,
			outputPath,
		]

		const ffmpegProcess = spawn('ffmpeg', ffmpegArgs, {
			stdio: ['ignore', 'ignore', 'pipe'],
		})

		subscriber.add(() => {
			if (ffmpegProcess.exitCode == null) {
				ffmpegProcess.kill() || ffmpegProcess.kill('SIGKILL')
			}
		})

		ffmpegProcess.once('error', (error) => {
			subscriber.error(error)
		})
		ffmpegProcess.once('exit', (code, signal) => {
			if (code === 0) {
				subscriber.complete()
			} else if (code != null) {
				subscriber.error(new Error(`Finished with status code ${code}`))
			} else {
				subscriber.error(new Error(`Received a "${signal}" signal`))
			}
		})

		let duration = 0

		ffmpegProcess.stderr.on('data', (chunk) => {
			const utf8Chunk: string = chunk.toString()

			if (duration === 0) {
				const durationMatch = utf8Chunk.match(DURATION_REG_EXP)
				if (durationMatch) {
					const [hours, minutes, seconds, milliseconds] =
						durationMatch.slice(1, 5).map((value) => +value)
					duration = toMs({ hours, milliseconds, minutes, seconds })
				}
			}

			const timeMatch = utf8Chunk.match(TIME_REG_EXP)
			if (timeMatch) {
				const [hours, minutes, seconds, milliseconds] = timeMatch
					.slice(1, 5)
					.map((value) => +value)
				const time = toMs({ hours, milliseconds, minutes, seconds })

				subscriber.next({
					current: time,
					progress: duration && time / duration,
					total: duration,
				})
			}
		})
	})
}
