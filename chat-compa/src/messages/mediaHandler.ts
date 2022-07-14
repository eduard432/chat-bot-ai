import WAWebJS from 'whatsapp-web.js'
import chalk from 'chalk'
import { describeImageSdk, uploadImage } from '../apis/images'
import { uploadBlob } from '../apis/uploadBlob'

export type MediaResponse = {
	message: string | null
	ok: boolean
}

const mediaHandler = async (
	message: WAWebJS.Message,
	phone: string
): Promise<MediaResponse | undefined> => {
	try {
		const media = await message.downloadMedia()
		if (media.mimetype === 'image/jpeg') {
			const data = media.data
			// const url = await uploadImage(Buffer.from(data, 'base64'))
			const url = await uploadBlob(
				Buffer.from(data, 'base64'),
				phone,
				'images-bot'
			)
			if (url) {
				const description = await describeImageSdk(url)
				return {
					message: `[DESCRIPCIÓN FOTO]: (${description || ''})`,
					ok: true,
				}
			}
		} else {
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
