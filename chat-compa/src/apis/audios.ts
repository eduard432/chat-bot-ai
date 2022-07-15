import {
	SpeechConfig,
	AudioConfig,
	SpeechRecognizer,
	ResultReason,
	CancellationReason,
	CancellationDetails,
	AudioStreamFormat,
} from 'microsoft-cognitiveservices-speech-sdk'
import fs from 'fs/promises'
import { readFile, writeFile } from '../helpers/fs'
import { exec } from 'child_process'
import axios, { AxiosRequestConfig } from 'axios'
import Logger from '../utils/Logger'
import path from 'path'
import { waitForExec } from '../helpers/exec'
// const command = `"C:/Program Files/File Converter/FileConverter.exe" --conversion-preset "To Wav" "C:\Users\enriq\Desktop\chat-bot-ai\chat-compa\audios\Voz-006.ogg"`
const { err, log, mgt, ylw } = new Logger()

export const convertOggToWav = async (data: Buffer, fileName: string) => {
	await writeFile(`./audios/${fileName}.ogg`, data)
	const pathAudio = path.resolve(`audios/${fileName}.ogg`)
	const child = exec(
		`"C:/Program Files/File Converter/FileConverter.exe" --conversion-preset "To Wav" "${pathAudio}"`
	)
	await waitForExec(child)
	await fs.unlink(`./audios/${fileName}.ogg`)
}

export const describeAudioApi = (data: Buffer) => {
	const SPEECH_RECOGNITION_KEY: any = process.env.SPEECH_RECOGNITION_KEY
	const SPEECH_RECOGNITION_ENDPOINT: any =
		process.env.SPEECH_RECOGNITION_ENDPOINT
	const config: AxiosRequestConfig = {
		method: 'post',
		url: SPEECH_RECOGNITION_ENDPOINT,
		params: {
			language: 'es-MX',
			format: 'simple',
		},
		headers: {
			'Content-Type': 'audio/wav; codecs=audio/pcm; samplerate=16000',
			'Ocp-Apim-Subscription-Key': SPEECH_RECOGNITION_KEY,
		},
		data,
	}
	return axios(config)
}
