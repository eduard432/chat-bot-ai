import WAWebJS from 'whatsapp-web.js'
import chalk from 'chalk'
import { describeImageSdk, uploadImage } from '../apis/images'
import { uploadBlob } from '../apis/uploadBlob'
import { v1 as uuid } from 'uuid'
import { convertOggToWav, describeAudioApi } from '../apis/audios'
import { readFile } from '../helpers/fs'
import fs from 'fs/promises'

export type MediaResponse = {
	message: string | null
	ok: boolean
}

const imageHandler = async (media: WAWebJS.MessageMedia, phone: string) => {
	const data = media.data
	// const url = await uploadImage(Buffer.from(data, 'base64'))
	const name = `${phone}-${uuid()}.jpeg`
	const url = await uploadBlob(
		Buffer.from(data, 'base64'),
		name,
		'images-bot'
	)
	if (url) {
		const description = await describeImageSdk(url)
		return {
			message: `[DESCRIPCIÓN FOTO]: (${description || ''})`,
			ok: true,
		}
	}
}

const audioHandler = async (media: WAWebJS.MessageMedia, phone: string) => {
	const data = media.data
	const name = `${phone}-${uuid()}`
	const fileName = name + '.ogg'
	const buffer = Buffer.from(data, 'base64')
	await convertOggToWav(buffer, fileName)
	const bufferWav = await readFile(`./audios/${name}.wav`)
	const text = await describeAudioApi(bufferWav)
	const url = await uploadBlob(bufferWav, `${name}.wav`, 'audios-bot')
	if (url) {
		await fs.unlink(`./audios/${name}.wav`)
		return {
			message: text,
			ok: true
		}
	}
}

const mediaHandler = async (
	message: WAWebJS.Message,
	phone: string
): Promise<MediaResponse | undefined> => {
	try {
		const media = await message.downloadMedia()

		switch (media.mimetype) {
			case 'image/jpeg':
				return imageHandler(media, phone)

			case 'audio/ogg; codecs=opus':
				return audioHandler(media, phone)

			default:
				throw new Error(
					`Not supported mimetype: ${media.mimetype} - Filename: ${media.filename}`
				)
		}
	} catch (error) {
		console.log(chalk.red(error))
		return {
			message: null,
			ok: false,
		}
	}
}

export default mediaHandler
