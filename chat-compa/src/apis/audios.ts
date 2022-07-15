import fs from 'fs/promises'
import { writeFile } from '../helpers/fs'
import { exec } from 'child_process'
import axios from 'axios'
import path from 'path'
import { waitForExec } from '../helpers/exec'
import Logger from '../utils/Logger'
// const command = `"C:/Program Files/File Converter/FileConverter.exe" --conversion-preset "To Wav" "C:\Users\enriq\Desktop\chat-bot-ai\chat-compa\audios\Voz-006.ogg"`

type AudioDescriptionResponse = {
	RecognitionStatus: string
	DisplayText: string
	Offset: number
	Duration: number
}

const { log } = new Logger()

export const convertOggToWav = async (data: Buffer, fileName: string) => {
	await writeFile(`./audios/${fileName}`, data)
	const pathAudio = path.resolve(`audios/${fileName}`)
	const child = exec(
		`"C:/Program Files/File Converter/FileConverter.exe" --conversion-preset "To Wav" "${pathAudio}"`
	)
	await waitForExec(child)
	await fs.unlink(`./audios/${fileName}`)
}

export const describeAudioApi = async (data: Buffer) => {
	const SPEECH_RECOGNITION_KEY: any = process.env.SPEECH_RECOGNITION_KEY
	const SPEECH_RECOGNITION_ENDPOINT: any =
		process.env.SPEECH_RECOGNITION_ENDPOINT
	try {
		const response = await axios.post<AudioDescriptionResponse>(
			SPEECH_RECOGNITION_ENDPOINT,
			data,
			{
				params: {
					language: 'es-MX',
					format: 'simple',
				},
				headers: {
					'Content-Type': 'audio/wav; codecs=audio/pcm; samplerate=16000',
					'Ocp-Apim-Subscription-Key': SPEECH_RECOGNITION_KEY,
				},
			}
		)
		return response.data.DisplayText
	} catch (error) {
		log(error)
		return 'No te entiendo'
	}
}
