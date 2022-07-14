import WAWebJS from 'whatsapp-web.js'
import chalk from 'chalk'
import { describeImage, uploadImage } from '../apis/images'

export type MediaResponse = {
	message: string | null
	ok: boolean
}

const mediaHandler = async (
	message: WAWebJS.Message
): Promise<MediaResponse | undefined> => {
	try {
		const media = await message.downloadMedia()
		if (media.mimetype === 'image/jpeg') {
			const data = media.data
			const url = await uploadImage(Buffer.from(data, 'base64'))
			const description = await describeImage(url)

			return {
				message: `[DESCRIPCIÓN FOTO]: (${description || ''})`,
				ok: true,
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
