import WAWebJS from 'whatsapp-web.js'
import chalk from 'chalk'
import { describeImage, uploadImage } from '../apis/images'

const mediaHandler = async (message: WAWebJS.Message): Promise<string | undefined> => {
	try {
		const media = await message.downloadMedia()
		if (media.mimetype === 'image/jpeg') {
			const data = media.data
			const url = await uploadImage(Buffer.from(data, 'base64'))
			const description = await describeImage(url)

            return `[DESCRIPCIÓN FOTO]: (${description || ''})`
		}
	} catch (error) {
		console.log(chalk.red(error))
	}
}

export default mediaHandler